import type { LinearBezierCurve } from 'Math/curves/LinearBezierCurve';
import { directionOfLinearBezierCurve } from 'Math/curves/directionOfLinearBezierCurve';

import type { QuadraticBezierCurve } from 'Math/curves/QuadraticBezierCurve';
import { isQuadraticBezierCurve } from 'Math/curves/QuadraticBezierCurve';
import { directionOfQuadraticBezierCurve } from 'Math/curves/directionOfQuadraticBezierCurve';

export type BezierCurve = (
  LinearBezierCurve
  | QuadraticBezierCurve
);

/**
 * Returns the angle (in radians) that is the direction of the bezier curve
 * for a given value of t where t of 0 corresponds to the start point and
 * t of 1 corresponds to the end point of the bezier curve.
 */
export function directionOfBezierCurve(curve: BezierCurve, t: number): number {
  // note that a quadratic bezier curve actually fits the type definition
  // of a linear bezier curve (so need to check if is a quadratic bezier
  // curve first)
  if (isQuadraticBezierCurve(curve)) {
    return directionOfQuadraticBezierCurve(curve, t);
  } else {
    return directionOfLinearBezierCurve(curve);
  }
}
