import { Point2D } from 'Math/points/Point';
import { subtract2D } from 'Math/points/displacement';
import { magnitude2D } from 'Math/points/magnitude';

/**
 * Calculates the distance between the two points.
 */
export function distance2D(p1: Point2D, p2: Point2D): number {
  return magnitude2D(subtract2D(p1, p2));
}
