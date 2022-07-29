import type { Point2D as Point } from 'Math/points/Point';
import type { Point2D as Vector } from 'Math/points/Point';

export type Args = {
  /**
   * The point on the curve to displace.
   */
  pointOnCurve: Point;

  /**
   * The angle (in radians) that is the direction of the curve
   * at the point on the curve.
   */
  directionOfCurve: number;

  /**
   * Vector to displace the point on the curve by.
   *
   * The coordinate system for the vector uses the point on the curve
   * as its origin and the direction of the curve at the point as
   * its positive Y axis direction. 90 degrees clockwise of the positive
   * Y axis direction is the positive X axis direction.
   */
  displacement: Vector;
};

export function displacePointFromCurve(args: Args): Point {
  let c = args.displacement.y;
  let a = args.directionOfCurve;
  let p = {
    x: args.pointOnCurve.x + (c * Math.cos(a)),
    y: args.pointOnCurve.y + (c * Math.sin(a)),
  };

  c = args.displacement.x;
  a = args.directionOfCurve + (Math.PI / 2);
  p = {
    x: p.x + (c * Math.cos(a)),
    y: p.y + (c * Math.sin(a)),
  };

  return p;
}
