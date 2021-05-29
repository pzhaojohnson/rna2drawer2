import { PerBaseStrictLayoutProps as PerBaseProps } from './PerBaseStrictLayoutProps';
import { Partners } from 'Partners/Partners';
import { pair, unpair } from 'Partners/edit';
import { containingStem } from 'Partners/containing';

export function resetStemProps(props: PerBaseProps) {
  let defaults = new PerBaseProps();
  props.flipStem = defaults.flipStem;
  props.loopShape = defaults.loopShape;
  props.triangleLoopHeight = defaults.triangleLoopHeight;
}

export function copyStemProps(fromProps: PerBaseProps, toProps: PerBaseProps) {
  toProps.flipStem = fromProps.flipStem;
  toProps.loopShape = fromProps.loopShape;
  toProps.triangleLoopHeight = fromProps.triangleLoopHeight;
}

interface IntegerRange {
  start: number;
  end: number;
}

export function willPair(partners: Partners, perBaseProps: PerBaseProps[], r1: IntegerRange, r2: IntegerRange) {
  let [rBefore, rAfter] = r1.start < r2.start ? [r1, r2] : [r2, r1];
  let props5 = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, rBefore.start);
  resetStemProps(props5);
  let paired = [...partners];
  for (let p = rBefore.start; p <= rBefore.end; p++) {
    let q = rAfter.end - (p - rBefore.start);
    pair(paired, p, q);
  }
  let st1 = containingStem(partners, rBefore.end + 1);
  let st2 = containingStem(paired, rBefore.end + 1);
  if (st1 && st2 && st1.position5 != st2.position5) {
    let fromProps = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, st1.position5);
    let toProps = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, st2.position5);
    let shouldFlip = st2.position5 < rBefore.start ? toProps.flipStem : fromProps.flipStem;
    copyStemProps(fromProps, toProps);
    toProps.flipStem = shouldFlip;
    resetStemProps(fromProps);
  }
}

export function willUnpair(partners: Partners, perBaseProps: PerBaseProps[], r: IntegerRange) {
  let unpaired = [...partners];
  for (let p = r.start; p <= r.end; p++) {
    unpair(unpaired, p);
  }
  [r.start - 1, r.end + 1].forEach(p => {
    let st1 = containingStem(partners, p);
    let st2 = containingStem(unpaired, p);
    if (st1 && st2 && st1.position5 != st2.position5) {
      let fromProps = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, st1.position5);
      let toProps = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, st2.position5);
      copyStemProps(fromProps, toProps);
      let wasFlipped = fromProps.flipStem;
      resetStemProps(fromProps);
      let wasSplit = containingStem(unpaired, st1.position5) ? true : false;
      if (wasFlipped && wasSplit) {
        fromProps.flipStem = true;
        toProps.flipStem = false;
      }
    }
  });
}

export function willRemove(partners: Partners, perBaseProps: PerBaseProps[], r: IntegerRange) {
  willUnpair(partners, perBaseProps, r);
}

export function willInsertAt(partners: Partners, perBaseProps: PerBaseProps[], p: number) {
  let st = containingStem(partners, p);
  if (st && st.position5 < p) {
    let fromProps = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, st.position5);
    let toProps = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, p);
    copyStemProps(fromProps, toProps);
    let wasFlipped = fromProps.flipStem;
    resetStemProps(fromProps);
    if (wasFlipped) {
      fromProps.flipStem = true;
      toProps.flipStem = false;
    }
  }
}
