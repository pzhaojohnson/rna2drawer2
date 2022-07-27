import type { QuadraticBezierCurve } from 'Math/curves/QuadraticBezierCurve';
import { distance2D as distance } from 'Math/points/distance';

/**
 * Approximates the length of the quadratic bezier curve using a technique
 * described here:
 * https://raphlinus.github.io/curves/2018/12/28/bezier-arclength.html
 */
export function lengthOfQuadraticBezierCurve(curve: QuadraticBezierCurve): number {
  let d1 = distance(curve.startPoint, curve.controlPoint);
  let d2 = distance(curve.controlPoint, curve.endPoint);
  let d3 = distance(curve.startPoint, curve.endPoint);

  // the perimeter of the polygon formed by the three points
  // defining the quadratic bezier curve
  let perimeter = d1 + d2 + d3;

  // usually a good estimate practically speaking
  return (2 / 3) * d3 + (1 / 3) * perimeter;
}
