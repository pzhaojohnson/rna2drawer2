import type { StraightBond } from 'Draw/bonds/straight/StraightBond';
import type { QuadraticBezierBond } from 'Draw/bonds/curved/QuadraticBezierBond';

import { distance2D as distance } from 'Draw/svg/math/distance';

export type Bond = StraightBond | QuadraticBezierBond;

export function curveLengthOfBond(bond: Bond): number {
  if ('path' in bond) {
    return bond.path.length();
  } else {
    // could just use SVGLineElement getTotalLength method, but this method
    // doesn't seem to work when unit testing on Node.js
    let x1: unknown = bond.line.attr('x1');
    let y1: unknown = bond.line.attr('y1');
    let x2: unknown = bond.line.attr('x2');
    let y2: unknown = bond.line.attr('y2');
    return distance(x1, y1, x2, y2) ?? 0;
  }
}
