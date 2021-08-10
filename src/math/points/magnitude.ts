import { Point2D as Vector2D } from 'Math/points/Point';

export function magnitude2D(v: Vector2D): number {
  return (v.x**2 + v.y**2)**0.5;
}
