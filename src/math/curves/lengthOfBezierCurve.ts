import type { LinearBezierCurve } from 'Math/curves/LinearBezierCurve';
import { lengthOfLinearBezierCurve } from 'Math/curves/lengthOfLinearBezierCurve';

import type { QuadraticBezierCurve } from 'Math/curves/QuadraticBezierCurve';
import { isQuadraticBezierCurve } from 'Math/curves/QuadraticBezierCurve';
import { lengthOfQuadraticBezierCurve } from 'Math/curves/lengthOfQuadraticBezierCurve';

export type BezierCurve = (
  LinearBezierCurve
  | QuadraticBezierCurve
);

export function lengthOfBezierCurve(curve: BezierCurve): number {
  // note that a quadratic bezier curve actually fits the type definition
  // of a linear bezier curve (so need to check if is a quadratic bezier
  // curve first)
  if (isQuadraticBezierCurve(curve)) {
    return lengthOfQuadraticBezierCurve(curve);
  } else {
    return lengthOfLinearBezierCurve(curve);
  }
}
