import { lengthOfQuadraticBezierCurve } from './lengthOfQuadraticBezierCurve';

describe('lengthOfQuadraticBezierCurve function', () => {
  test('when the points defining the curve are all different', () => {
    let curve = {
      startPoint: { x: 25, y: 88 },
      controlPoint: { x: 230, y: 157 },
      endPoint: { x: 189, y: 138 },
    };
    let l = lengthOfQuadraticBezierCurve(curve);
    expect(l).toBeCloseTo(258.6156875968195);
  });

  test('when the start and end points of the curve are the same', () => {
    let curve = {
      startPoint: { x: 50, y: 60 },
      controlPoint: { x: 200, y: 220 },
      endPoint: { x: 50, y: 60 },
    };
    let l = lengthOfQuadraticBezierCurve(curve);
    expect(l).toBeCloseTo(146.21141466307537);
  });
});
