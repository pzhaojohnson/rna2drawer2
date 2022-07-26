import type { Point2D } from 'Math/points/Point';

/**
 * Adds the two points together.
 */
export function add2D(p1: Point2D, p2: Point2D): Point2D {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y,
  };
}
