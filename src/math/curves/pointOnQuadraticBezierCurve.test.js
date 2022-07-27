import { pointOnQuadraticBezierCurve } from './pointOnQuadraticBezierCurve';

describe('pointOnQuadraticBezierCurve function', () => {
  test('for t of 0', () => {
    let curve = {
      startPoint: { x: 50, y: 60 },
      controlPoint: { x: 2000, y: 68 },
      endPoint: { x: 330, y: 500 },
    };
    let p = pointOnQuadraticBezierCurve(curve, 0);
    expect(p.x).toBeCloseTo(50);
    expect(p.y).toBeCloseTo(60);
  });

  test('for t of 1', () => {
    let curve = {
      startPoint: { x: -50, y: -2 },
      controlPoint: { x: -56, y: -98 },
      endPoint: { x: 14, y: -3.8 },
    };
    let p = pointOnQuadraticBezierCurve(curve, 1);
    expect(p.x).toBeCloseTo(14);
    expect(p.y).toBeCloseTo(-3.8);
  });

  test('for t between 0 and 1', () => {
    let curve = {
      startPoint: { x: 32, y: 68 },
      controlPoint: { x: 112, y: 180 },
      endPoint: { x: 200, y: 87 },
    };
    let p = pointOnQuadraticBezierCurve(curve, 0.38);
    expect(p.x).toBeCloseTo(93.95519999999999);
    expect(p.y).toBeCloseTo(123.51800000000001);
  });

  test('for t less than 0', () => {
    let curve = {
      startPoint: { x: 8, y: 4 },
      controlPoint: { x: -20, y: -34 },
      endPoint: { x: -29, y: -2 },
    };
    let p = pointOnQuadraticBezierCurve(curve, -0.85);
    expect(p.x).toBeCloseTo(69.32750000000001);
    expect(p.y).toBeCloseTo(119.17500000000001);
  });

  test('for t greater than 1', () => {
    let curve = {
      startPoint: { x: -3, y: -1 },
      controlPoint: { x: -20, y: -21 },
      endPoint: { x: -42, y: 2 },
    };
    let p = pointOnQuadraticBezierCurve(curve, 1.24);
    expect(p.x).toBeCloseTo(-52.848000000000006);
    expect(p.y).toBeCloseTo(15.516800000000003);
  });
});
