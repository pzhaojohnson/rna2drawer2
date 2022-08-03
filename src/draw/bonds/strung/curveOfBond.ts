import type { BezierCurve } from 'Draw/bonds/strung/BezierCurve';

import { isLinearBezierCurve } from 'Math/curves/LinearBezierCurve';
import { isQuadraticBezierCurve } from 'Math/curves/QuadraticBezierCurve';

import type { StraightBond } from 'Draw/bonds/straight/StraightBond';
import type { QuadraticBezierBond } from 'Draw/bonds/curved/QuadraticBezierBond';

import { interpretNumericValue } from 'Draw/svg/interpretNumericValue';

export type Bond = StraightBond | QuadraticBezierBond;

function curveOfStraightBond(bond: StraightBond) {
  let curve = {
    startPoint: {
      x: interpretNumericValue(bond.line.attr('x1'))?.valueOf(),
      y: interpretNumericValue(bond.line.attr('y1'))?.valueOf(),
    },
    endPoint: {
      x: interpretNumericValue(bond.line.attr('x2'))?.valueOf(),
      y: interpretNumericValue(bond.line.attr('y2'))?.valueOf(),
    },
  };

  return isLinearBezierCurve(curve) ? curve : undefined;
}

function curveOfQuadraticBezierBond(bond: QuadraticBezierBond) {
  let pathArray = bond.path.array();
  let m = pathArray[0];
  let q = pathArray[1];

  if (!m || m[0] != 'M') {
    return undefined;
  } else if (!q || q[0] != 'Q') {
    return undefined;
  }

  let curve = {
    startPoint: {
      x: interpretNumericValue(m[1])?.valueOf(),
      y: interpretNumericValue(m[2])?.valueOf(),
    },
    controlPoint: {
      x: interpretNumericValue(q[1])?.valueOf(),
      y: interpretNumericValue(q[2])?.valueOf(),
    },
    endPoint: {
      x: interpretNumericValue(q[3])?.valueOf(),
      y: interpretNumericValue(q[4])?.valueOf(),
    },
  };

  return isQuadraticBezierCurve(curve) ? curve : undefined;
}

/**
 * Returns undefined if the curve of the bond cannot be interpreted.
 */
export function curveOfBond(bond: Bond): BezierCurve | undefined {
  if ('line' in bond) {
    return curveOfStraightBond(bond);
  } else {
    return curveOfQuadraticBezierBond(bond);
  }
}
