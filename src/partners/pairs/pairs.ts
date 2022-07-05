import type { Partners } from 'Partners/Partners';
import type { Pair } from 'Partners/pairs/Pair';

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
