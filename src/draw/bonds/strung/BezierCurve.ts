import type { LinearBezierCurve } from 'Math/curves/LinearBezierCurve';
import type { QuadraticBezierCurve } from 'Math/curves/QuadraticBezierCurve';

export type BezierCurve = (
  LinearBezierCurve
  | QuadraticBezierCurve
);
