import { Point2D } from 'Math/points/Point';
import { Point2D as Vector2D } from 'Math/points/Point';
import { subtract2D } from 'Math/points/subtract';

/**
 * Returns the displacement from point 1 to point 2.
 */
export function displacement2D(p1: Point2D, p2: Point2D): Vector2D {
  return subtract2D(p2, p1);
}
