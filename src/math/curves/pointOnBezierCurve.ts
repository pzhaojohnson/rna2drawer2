import type { Point2D as Point } from 'Math/points/Point';

import type { LinearBezierCurve } from 'Math/curves/LinearBezierCurve';
import { pointOnLinearBezierCurve } from 'Math/curves/pointOnLinearBezierCurve';

import type { QuadraticBezierCurve } from 'Math/curves/QuadraticBezierCurve';
import { isQuadraticBezierCurve } from 'Math/curves/QuadraticBezierCurve';
import { pointOnQuadraticBezierCurve } from 'Math/curves/pointOnQuadraticBezierCurve';

export type BezierCurve = (
  LinearBezierCurve
  | QuadraticBezierCurve
);

/**
 * Returns a point on the bezier curve for a given value of t
 * where t of 0 corresponds to the start point and t of 1 corresponds
 * to the end point of the bezier curve.
 */
export function pointOnBezierCurve(curve: BezierCurve, t: number): Point {
  // note that a quadratic bezier curve actually fits the type definition
  // of a linear bezier curve (so need to check if is a quadratic bezier
  // curve first)
  if (isQuadraticBezierCurve(curve)) {
    return pointOnQuadraticBezierCurve(curve, t);
  } else {
    return pointOnLinearBezierCurve(curve, t);
  }
}
