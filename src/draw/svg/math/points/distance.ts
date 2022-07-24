// the underlying distance2D function
import { distance2D as _distance2D } from 'Draw/svg/math/distance';

import type { Point2D } from 'Draw/svg/math/points/Point';

/**
 * Calculates the distance between two points whose coordinates
 * are SVG numeric values.
 *
 * Returns undefined if any of the points coordinates cannot be interpreted.
 */
export function distance2D(p1: Point2D, p2: Point2D): number | undefined {
  return _distance2D(p1.x, p1.y, p2.x, p2.y);
}
