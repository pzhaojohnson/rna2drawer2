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
export function treeify(partners: Partners): Partners {
  let noKnots = unstructuredPartners(partners.length);

  // a stack of upstream partners
  let ups: number[] = [];

  partners.forEach((q, i) => {
    let p = i + 1;
    if (q == undefined) {
      // nothing to do
    } else if (p < q) {
      ups.push(p);
    } else {
      while (ups.length > 0 && ups[ups.length - 1] > q) {
        ups.pop();
      }
      if (ups.length > 0 && ups[ups.length - 1] == q) {
        ups.pop();
        pair(noKnots, p, q);
      }
    }
  });

  return noKnots;
}
