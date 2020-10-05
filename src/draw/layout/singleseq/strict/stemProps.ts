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
  let st = stemOfPosition(rBefore.end + 1, partners);
  if (st && st.position3 == rAfter.start - 1) {
    let fromProps = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, st.position5);
    let toProps = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, rBefore.start);
    copyStemProps(fromProps, toProps);
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
