import { normalizeAngle } from 'Math/angles/normalizeAngle';

import { directionOfQuadraticBezierCurve } from './directionOfQuadraticBezierCurve';

describe('directionOfQuadraticBezierCurve function', () => {
  test('for t of 0', () => {
    let curve = {
      startPoint: { x: 12, y: 28 },
      controlPoint: { x: 23, y: 32 },
      endPoint: { x: 20, y: 24 },
    };
    let a = directionOfQuadraticBezierCurve(curve, 0);
    a = normalizeAngle(a);
    expect(a).toBeCloseTo(0.348771003583907);
  });

  test('for t of 1', () => {
    let curve = {
      startPoint: { x: -28, y: 4 },
      controlPoint: { x: 0, y: 12 },
      endPoint: { x: 15, y: 20 },
    };
    let a = directionOfQuadraticBezierCurve(curve, 1);
    a = normalizeAngle(a);
    expect(a).toBeCloseTo(0.4899573262537283);
  });

  test('for t between 0 and 1', () => {
    let curve = {
      startPoint: { x: 100, y: 200 },
      controlPoint: { x: 112, y: 250 },
      endPoint: { x: 150, y: 211 },
    };
    let a = directionOfQuadraticBezierCurve(curve, 0.61);
    a = normalizeAngle(a);
    expect(a).toBeCloseTo(6.130401120655891);
  });

  test('for t less than 0', () => {
    let curve = {
      startPoint: { x: 23, y: 98 },
      controlPoint: { x: 37, y: 98 },
      endPoint: { x: 48, y: 67 },
    };
    let a = directionOfQuadraticBezierCurve(curve, -0.5);
    a = normalizeAngle(a);
    expect(a).toBeCloseTo(0.7853981633974483);
  });

  test('for t greater than 1', () => {
    let curve = {
      startPoint: { x: -65, y: -23 },
      controlPoint: { x: -100, y: -200 },
      endPoint: { x: -98, y: 3 },
    };
    let a = directionOfQuadraticBezierCurve(curve, 1.9);
    a = normalizeAngle(a);
    expect(a).toBeCloseTo(1.5061160333265786);
  });
});
