import { Point2D, Point2D as Vector2D } from 'Math/points/Point';

// subtract p2 from p1
export function subtract2D(p1: Point2D, p2: Point2D): Vector2D {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}
