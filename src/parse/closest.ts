import { stemOfPosition } from './stemOfPosition';

type PartnersNotation = (number | null)[];

interface Stem {
  position5: number;
  position3: number;
  size: number;
}

export function closestPairOuterTo(partners: PartnersNotation, p: number): [number, number] | undefined {
  let r = p - 1;
  while (r > 0) {
    let s = partners[r - 1];
    if (typeof s == 'number' && s > p) {
      return [r, s];
    }
    r--;
  }
}

export function closestStemOuterTo(partners: PartnersNotation, v: number): Stem | undefined {
  let pair = closestPairOuterTo(partners, v);
  if (pair) {
    let st = stemOfPosition(pair[0], partners);
    if (st) {
      return st;
    }
  }
}
