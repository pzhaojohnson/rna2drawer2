import type { Point2D } from 'Math/points/Point';
import { add2D } from 'Math/points/add';
import { subtract2D } from 'Math/points/subtract';

export type Args2D = {
  /**
   * The point to rotate.
   */
  point: Point2D;

  /**
   * The reference point around which the point is rotated.
   */
  origin: Point2D;

  /**
   * The angle of rotation.
   * (How much to rotate the point by in radians).
   */
  angle: number;
};

/**
 * Returns the rotated point.
 */
export function rotatePoint2D(args: Args2D): Point2D {
  let s = Math.sin(args.angle);
  let c = Math.cos(args.angle);

  let p = subtract2D(args.point, args.origin);

  p = {
    x: (c * p.x) - (s * p.y),
    y: (s * p.x) + (c * p.y),
  };

  p = add2D(p, args.origin);
  return p;
}
