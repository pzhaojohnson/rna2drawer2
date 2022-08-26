import type { Bond } from 'Forms/edit/bonds/strung/Bond';
import type { StrungElement } from 'Draw/bonds/strung/StrungElement';

import { removeStrungElementFromBond } from 'Draw/bonds/strung/addToBond';

import { atIndex } from 'Array/at';

export type Args = {
  bonds: Bond[];
  index: number;
};

/**
 * Removes the strung elements at the specified index in each of the
 * strung elements arrays of the provided bonds.
 */
export function removeStrungElementsAtIndex(args: Args) {
  args.bonds.forEach(bond => {
    let strungElement: StrungElement | undefined;
    strungElement = atIndex(bond.strungElements, args.index);
    if (strungElement) {
      removeStrungElementFromBond({ bond, strungElement });
    }
  });
}
