import { pointOnLinearBezierCurve } from './pointOnLinearBezierCurve';

describe('pointOnLinearBezierCurve function', () => {
  test('for t of 0', () => {
    let curve = { startPoint: { x: 6, y: 8 }, endPoint: { x: -22, y: -15 } };
    let p = pointOnLinearBezierCurve(curve, 0);
    expect(p.x).toBeCloseTo(6);
    expect(p.y).toBeCloseTo(8);
  });

  test('for t of 1', () => {
    let curve = { startPoint: { x: 9, y: 1 }, endPoint: { x: 12.5, y: 33.5 } };
    let p = pointOnLinearBezierCurve(curve, 1);
    expect(p.x).toBeCloseTo(12.5);
    expect(p.y).toBeCloseTo(33.5);
  });

  test('for t between 0 and 1', () => {
    let curve = { startPoint: { x: 8, y: 9.9 }, endPoint: { x: 12.2, y: -3 } };
    let p = pointOnLinearBezierCurve(curve, 0.33);
    expect(p.x).toBeCloseTo(9.386);
    expect(p.y).toBeCloseTo(5.643);
  });

  test('for t less than 0', () => {
    let curve = { startPoint: { x: -5, y: -3 }, endPoint: { x: -22, y: -9 } };
    let p = pointOnLinearBezierCurve(curve, -0.8);
    expect(p.x).toBeCloseTo(8.600000000000001);
    expect(p.y).toBeCloseTo(1.8000000000000007);
  });

  test('for t greater than 1', () => {
    let curve = { startPoint: { x: 6, y: 20 }, endPoint: { x: 8, y: 32 } };
    let p = pointOnLinearBezierCurve(curve, 1.6);
    expect(p.x).toBeCloseTo(9.2);
    expect(p.y).toBeCloseTo(39.2);
  });
});
