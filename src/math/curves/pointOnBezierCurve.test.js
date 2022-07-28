import { pointOnBezierCurve } from './pointOnBezierCurve';

describe('pointOnBezierCurve function', () => {
  test('a linear bezier curve', () => {
    let curve = {
      startPoint: { x: 5, y: 9 },
      endPoint: { x: 12, y: -22 },
    };
    let p = pointOnBezierCurve(curve, 0.4);
    expect(p.x).toBeCloseTo(7.8);
    expect(p.y).toBeCloseTo(-3.4);
  });

  test('a quadratic bezier curve', () => {
    let curve = {
      startPoint: { x: -8, y: 2 },
      controlPoint: { x: -18, y: 32 },
      endPoint: { x: -21, y: -10 },
    };
    let p = pointOnBezierCurve(curve, 0.7);
    expect(p.x).toBeCloseTo(-18.57);
    expect(p.y).toBeCloseTo(8.720000000000002);
  });
});
