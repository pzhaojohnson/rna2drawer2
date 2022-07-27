import { normalizeAngle } from 'Math/angles/normalizeAngle';

import { directionOfLinearBezierCurve } from './directionOfLinearBezierCurve';

describe('directionOfLinearBezierCurve function', () => {
  test('when the end point is to the bottom-right of the start point', () => {
    let curve = { startPoint: { x: 3, y: 8 }, endPoint: { x: 11, y: -5 } };
    let a = directionOfLinearBezierCurve(curve);
    a = normalizeAngle(a);
    expect(a).toBeCloseTo(5.264043962913236);
  });

  test('when the end point is to the top-left of the start point', () => {
    let curve = { startPoint: { x: 2, y: 6 }, endPoint: { x: -20, y: 12 } };
    let a = directionOfLinearBezierCurve(curve);
    a = normalizeAngle(a);
    expect(a).toBeCloseTo(2.875340604438868);
  });

  test('when the start and end points are equal', () => {
    let curve = { startPoint: { x: 10, y: 10 }, endPoint: { x: 10, y: 10 } };
    let a = directionOfLinearBezierCurve(curve);
    expect(Number.isFinite(a)).toBeTruthy();
  });
});
