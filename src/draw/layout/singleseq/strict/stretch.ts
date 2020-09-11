import { PerBaseStrictLayoutProps as PerBaseProps } from './PerBaseStrictLayoutProps';

interface UnpairedRegion {
  boundingPosition5: number;
  boundingPosition3: number;
}

export function stretchOfUnpairedRegion(perBaseProps: PerBaseProps[], ur: UnpairedRegion): number {
  let s = 0;
  for (let p = ur.boundingPosition5; p < ur.boundingPosition3; p++) {
    let props = perBaseProps[p - 1];
    if (props) {
      s += props.stretch3;
    }
  }
  return s;
}

export function evenOutStretch(perBaseProps: PerBaseProps[], ur: UnpairedRegion) {
  let s = stretchOfUnpairedRegion(perBaseProps, ur);
  let stretches3 = ur.boundingPosition3 - ur.boundingPosition5;
  if (ur.boundingPosition5 < 1) {
    stretches3--;
  }
  if (stretches3 > 0) {
    for (let p = ur.boundingPosition5; p < ur.boundingPosition3; p++) {
      let props = perBaseProps[p - 1];
      if (props) {
        props.stretch3 = s / stretches3;
      }
    }
  }
}
