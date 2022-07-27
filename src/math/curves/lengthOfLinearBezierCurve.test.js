import { lengthOfLinearBezierCurve } from './lengthOfLinearBezierCurve';

describe('lengthOfLinearBezierCurve function', () => {
  test('when the length is greater than zero', () => {
    let curve = { startPoint: { x: -2, y: 12 }, endPoint: { x: 1, y: 8 } };
    let l = lengthOfLinearBezierCurve(curve);
    expect(l).toBeCloseTo(5);
  });

  test('when the length is zero', () => {
    let curve = { startPoint: { x: 12, y: 15 }, endPoint: { x: 12, y: 15 } };
    let l = lengthOfLinearBezierCurve(curve);
    expect(l).toBeCloseTo(0);
  });
});
