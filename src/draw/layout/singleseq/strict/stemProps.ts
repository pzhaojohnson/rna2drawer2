import { PerBaseStrictLayoutProps as PerBaseProps } from './PerBaseStrictLayoutProps';
import { stemOfPosition } from '../../../../parse/stemOfPosition';

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

export function willPair(partners: (number | null)[], perBaseProps: PerBaseProps[], r1: IntegerRange, r2: IntegerRange) {
  let [rBefore, rAfter] = r1.start < r2.start ? [r1, r2] : [r2, r1];
  let paired = [...partners];
  for (let p = rBefore.start; p <= rBefore.end; p++) {
    let q = rAfter.end - (p - rBefore.start);
    paired[p - 1] = q;
    paired[q - 1] = p;
  }
  let st1 = stemOfPosition(rBefore.end + 1, partners);
  let st2 = stemOfPosition(rBefore.end + 1, paired);
  if (st1 && st2 && st1.position5 != st2.position5) {
    let fromProps = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, st1.position5);
    let toProps = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, st2.position5);
    let shouldFlip = st2.position5 < rBefore.start ? toProps.flipStem : fromProps.flipStem;
    copyStemProps(fromProps, toProps);
    toProps.flipStem = shouldFlip;
    resetStemProps(fromProps);
  }
}

export function willUnpair(partners: (number | null)[], perBaseProps: PerBaseProps[], r: IntegerRange) {
  let unpaired = [...partners];
  for (let p = r.start; p <= r.end; p++) {
    let q = unpaired[p - 1];
    if (typeof q == 'number') {
      unpaired[p - 1] = null;
      unpaired[q - 1] = null;
    }
  }
  [r.start - 1, r.end + 1].forEach(p => {
    let st1 = stemOfPosition(p, partners);
    let st2 = stemOfPosition(p, unpaired);
    if (st1 && st2 && st1.position5 != st2.position5) {
      let fromProps = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, st1.position5);
      let toProps = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, st2.position5);
      copyStemProps(fromProps, toProps);
      let wasFlipped = fromProps.flipStem;
      resetStemProps(fromProps);
      let wasSplit = stemOfPosition(st1.position5, unpaired) ? true : false;
      if (wasFlipped && wasSplit) {
        fromProps.flipStem = true;
        toProps.flipStem = false;
      }
    }
  });
}

export function willRemove(partners: (number | null)[], perBaseProps: PerBaseProps[], r: IntegerRange) {
  willUnpair(partners, perBaseProps, r);
}

export function willInsertAt(partners: (number | null)[], perBaseProps: PerBaseProps[], p: number) {
  let st = stemOfPosition(p, partners);
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
