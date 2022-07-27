import { isQuadraticBezierCurve } from './QuadraticBezierCurve';

test('isQuadraticBezierCurve function', () => {
  // an actual quadratic bezier curve
  let curve = {
    startPoint: { x: 1, y: 2 },
    controlPoint: { x: 3, y: 4 },
    endPoint: { x: 5, y: 6 },
  };
  expect(isQuadraticBezierCurve(curve)).toBeTruthy();

  // non-object values
  expect(isQuadraticBezierCurve(1)).toBeFalsy();
  expect(isQuadraticBezierCurve('asdf')).toBeFalsy();
  expect(isQuadraticBezierCurve(true)).toBeFalsy();
  expect(isQuadraticBezierCurve(null)).toBeFalsy();
  expect(isQuadraticBezierCurve(undefined)).toBeFalsy();

  // objects missing points
  let startPoint = { x: 5, y: 2 };
  let controlPoint = { x: 20, y: 30 };
  let endPoint = { x: 100, y: 8 };
  expect(isQuadraticBezierCurve({ startPoint, controlPoint })).toBeFalsy();
  expect(isQuadraticBezierCurve({ startPoint, endPoint })).toBeFalsy();
  expect(isQuadraticBezierCurve({ controlPoint, endPoint })).toBeFalsy();

  // points missing coordinates
  curve = {
    startPoint: { x: 12, y: 24 },
    controlPoint: { x: 6, y: 7 },
    endPoint: { x: 5, y: 20 },
  };
  expect(
    isQuadraticBezierCurve({ ...curve, startPoint: { x: 2 } })
  ).toBeFalsy();
  expect(
    isQuadraticBezierCurve({ ...curve, controlPoint: { y: 6 } })
  ).toBeFalsy();
  expect(
    isQuadraticBezierCurve({ ...curve, endPoint: { x: 9 } })
  ).toBeFalsy();
});
