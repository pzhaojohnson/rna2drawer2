import { normalizeAngle } from 'Math/angles/normalizeAngle';

import { directionOfBezierCurve } from './directionOfBezierCurve';

describe('directionOfBezierCurve function', () => {
  test('a linear bezier curve', () => {
    let curve = {
      startPoint: { x: 60, y: 32 },
      endPoint: { x: -11, y: 15 },
    };
    let a = directionOfBezierCurve(curve, 0.3);
    a = normalizeAngle(a);
    expect(a).toBeCloseTo(3.3766048693104502);
  });

  test('a quadratic bezier curve', () => {
    let curve = {
      startPoint: { x: 4, y: 3 },
      controlPoint: { x: 0, y: 30 },
      endPoint: { x: -12, y: 6 },
    };
    let a = directionOfBezierCurve(curve, 0.9);
    a = normalizeAngle(a);
    expect(a).toBeCloseTo(4.177433906598593);
  });
});
