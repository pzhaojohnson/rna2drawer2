import { lengthOfBezierCurve } from './lengthOfBezierCurve';

describe('lengthOfBezierCurve function', () => {
  test('a linear bezier curve', () => {
    let curve = {
      startPoint: { x: 6, y: 3 },
      endPoint: { x: 11, y: -9 },
    };
    expect(lengthOfBezierCurve(curve)).toBeCloseTo(13);
  });

  test('a quadratic bezier curve', () => {
    let curve = {
      startPoint: { x: 20, y: 32 },
      controlPoint: { x: 41, y: 50 },
      endPoint: { x: 24, y: 35 },
    };
    expect(lengthOfBezierCurve(curve)).toBeCloseTo(21.77673382312931);
  });
});
