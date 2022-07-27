import type { Point2D as Point } from 'Math/points/Point';

export type QuadraticBezierCurve = {
  startPoint: Point;
  controlPoint: Point;
  endPoint: Point;
};
