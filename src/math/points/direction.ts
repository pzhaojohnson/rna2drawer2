import { Point2D as Vector2D } from 'Math/points/Point';

// returns the angle of the given vector relative to having started from
// the horizontal vector on the x-axis pointing in the positive direction
// (due east) and rotating counterclockwise
export function direction2D(v: Vector2D): number {
  return Math.atan2(v.y, v.x);
}
