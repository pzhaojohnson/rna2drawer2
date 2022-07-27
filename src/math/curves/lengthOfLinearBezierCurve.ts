import type { LinearBezierCurve } from 'Math/curves/LinearBezierCurve';
import { distance2D as distance } from 'Math/points/distance';

export function lengthOfLinearBezierCurve(curve: LinearBezierCurve): number {
  return distance(curve.startPoint, curve.endPoint);
}
