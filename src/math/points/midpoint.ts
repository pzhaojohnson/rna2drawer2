import { Point2D } from 'Math/points/Point';

/**
 * Calculates the point halfway between the two points.
 */
export function midpoint2D(p1: Point2D, p2: Point2D): Point2D {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}
