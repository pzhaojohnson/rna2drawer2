import type { Point2D as Point } from 'Math/points/Point';
import { isPoint2D as isPoint } from 'Math/points/Point';

export type QuadraticBezierCurve = {
  startPoint: Point;
  controlPoint: Point;
  endPoint: Point;
};

export function isQuadraticBezierCurve(v: any): v is QuadraticBezierCurve {
  return (
    typeof v == 'object'
    && v !== null
    && isPoint(v.startPoint)
    && isPoint(v.controlPoint)
    && isPoint(v.endPoint)
  );
}
