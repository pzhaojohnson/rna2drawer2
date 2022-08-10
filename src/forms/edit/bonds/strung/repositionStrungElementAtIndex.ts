import type { Bond } from 'Forms/edit/bonds/strung/Bond';

import { repositionStrungElement } from 'Draw/bonds/strung/repositionStrungElement';

import { curveOfBond } from 'Draw/bonds/strung/curveOfBond';
import { curveLengthOfBond } from 'Draw/bonds/strung/curveLengthOfBond';

import { atIndex } from 'Array/at';

export type Args = {
  bond: Bond;
  index: number;
};

/**
 * Repositions the strung element at the specified index in the strung
 * elements array of the bond.
 *
 * Does nothing if there is no strung element at the specified index.
 */
export function repositionStrungElementAtIndex(args: Args) {
  let bond = args.bond;
  let index = args.index;

  let strungElement = atIndex(bond.strungElements, index);

  let curve = curveOfBond(bond);
  let curveLength = curveLengthOfBond(bond);

  if (strungElement && curve) {
    repositionStrungElement(strungElement, { curve, curveLength });
  }
}
