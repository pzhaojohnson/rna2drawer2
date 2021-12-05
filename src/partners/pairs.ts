import { Partners } from 'Partners/Partners';
import { Pair } from 'Partners/Pair';

// returns all pairs in the partners notation
export function pairs(partners: Partners): Pair[] {
  let prs: Pair[] = [];
  partners.forEach((q, i) => {
    let p = i + 1;
    if (typeof q == 'number' && p < q) {
      prs.push([p, q]);
    }
  });
  return prs;
}