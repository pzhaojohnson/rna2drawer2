import type { Partners } from 'Partners/Partners';
import { unstructuredPartners } from 'Partners/unstructuredPartners';
import { pair } from 'Partners/edit';

/**
 * Returns a new partners array with all pairs creating knots
 * having been removed.
 * (Does not modify the input partners array.)
 *
 * May not remove knots optimally (i.e., may remove more pairs
 * than necessary).
 */
export function removeKnots(partners: Partners): Partners {
  let noKnots = unstructuredPartners(partners.length);
  // a stack of 5' partners
  let p5s: number[] = [];
  partners.forEach((q, i) => {
    let p = i + 1;
    if (typeof q != 'number') {
      // nothing to do
    } else if (p < q) {
      p5s.push(p);
    } else {
      while (p5s.length > 0 && p5s[p5s.length - 1] > q) {
        p5s.pop();
      }
      if (p5s.length > 0 && p5s[p5s.length - 1] == q) {
        p5s.pop();
        pair(noKnots, p, q);
      }
    }
  });
  return noKnots;
}
