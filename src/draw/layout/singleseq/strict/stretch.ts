import { PerBaseStrictLayoutProps as PerBaseProps } from './PerBaseStrictLayoutProps';

export type PerBasePropsArray = (PerBaseProps | undefined)[];

interface UnpairedRegion {
  boundingPosition5: number;
  boundingPosition3: number;
}

export function positionsWithStretch3(ur: UnpairedRegion): number[] {
  let ps = [] as number[];
  for (let p = ur.boundingPosition5; p < ur.boundingPosition3; p++) {
    if (p > 0) {
      ps.push(p);
    }
  }
  return ps;
}

export function stretchOfUnpairedRegion(perBaseProps: PerBasePropsArray, ur: UnpairedRegion): number {
  let s = 0;
  positionsWithStretch3(ur).forEach(p => {
    let props = perBaseProps[p - 1];
    if (props) {
      s += props.stretch3;
    }
  });
  return s;
}

export function evenOutStretch(perBaseProps: PerBasePropsArray, ur: UnpairedRegion) {
  let s = stretchOfUnpairedRegion(perBaseProps, ur);
  let ps = positionsWithStretch3(ur);
  if (ps.length > 0) {
    ps.forEach(p => {
      let props = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, p);
      props.stretch3 = s / ps.length;
    });
  }
}

export function addStretchEvenly(perBaseProps: PerBasePropsArray, ur: UnpairedRegion, s: number) {
  let ps = positionsWithStretch3(ur);
  if (ps.length > 0) {
    ps.forEach(p => {
      let props = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, p);
      props.stretch3 += s / ps.length;
    });
  }
}
