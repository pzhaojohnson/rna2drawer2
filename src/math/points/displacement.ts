import { Point2D, Point2D as Vector2D } from 'Math/points/Point';

/**
 * Subtracts point 2 from point 1.
 */
export function subtract2D(p1: Point2D, p2: Point2D): Vector2D {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}

/**
 * Returns the displacement from point 1 to point 2.
 */
export function displacement2D(p1: Point2D, p2: Point2D): Vector2D {
  return subtract2D(p2, p1);
}
