import type { StraightBond } from 'Draw/bonds/straight/StraightBond';
import type { QuadraticBezierBond } from 'Draw/bonds/curved/QuadraticBezierBond';

import { curveOfBond } from 'Draw/bonds/strung/curveOfBond';
import { curveLengthOfBond } from 'Draw/bonds/strung/curveLengthOfBond';

import { repositionStrungElement } from 'Draw/bonds/strung/repositionStrungElement';

export type Bond = StraightBond | QuadraticBezierBond;

export function repositionStrungElementsOfBond(bond: Bond) {
  let curve = curveOfBond(bond);
  let curveLength = curveLengthOfBond(bond);

  if (!curve) {
    console.error('Unable to interpret the curve of the bond.');
    return;
  }

  let positioning = { curve, curveLength };

  bond.strungElements.forEach(ele => {
    repositionStrungElement(ele, positioning);
  });
}
