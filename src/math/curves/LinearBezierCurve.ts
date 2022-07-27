import type { Point2D as Point } from 'Math/points/Point';
import { isPoint2D as isPoint } from 'Math/points/Point';

export type LinearBezierCurve = {
  startPoint: Point;
  endPoint: Point;
};

export function isLinearBezierCurve(v: any): v is LinearBezierCurve {
  return (
    typeof v == 'object'
    && v !== null
    && isPoint(v.startPoint)
    && isPoint(v.endPoint)
  );
}
