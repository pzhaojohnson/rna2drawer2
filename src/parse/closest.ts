import { Partners, partnerOf } from 'Partners/Partners';
import { Stem } from 'Partners/stems/Stem';
import { containingStem } from 'Partners/stems/containingStem';

export function closestPairOuterTo(partners: Partners, p: number): [number, number] | undefined {
  let r = p - 1;
  while (r > 0) {
    let s = partnerOf(partners, r);
    if (typeof s == 'number' && s > p) {
      return [r, s];
    }
    r--;
  }
}

export function closestStemOuterTo(partners: Partners, v: number): Stem | undefined {
  let pair = closestPairOuterTo(partners, v);
  if (pair) {
    let st = containingStem(partners, pair[0]);
    if (st) {
      return st;
    }
  }
}
