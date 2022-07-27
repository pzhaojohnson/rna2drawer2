import { isLinearBezierCurve } from './LinearBezierCurve';

test('isLinearBezierCurve function', () => {
  // an actual linear bezier curve
  let curve = { startPoint: { x: 50, y: 6 }, endPoint: { x: 1, y: -3 } };
  expect(isLinearBezierCurve(curve)).toBeTruthy();

  // non-object values
  expect(isLinearBezierCurve(5)).toBeFalsy();
  expect(isLinearBezierCurve('qwer')).toBeFalsy();
  expect(isLinearBezierCurve(true)).toBeFalsy();
  expect(isLinearBezierCurve(null)).toBeFalsy();
  expect(isLinearBezierCurve(undefined)).toBeFalsy();

  // objects missing points
  let startPoint = { x: 5, y: 2 };
  let endPoint = { x: 20, y: 30 };
  expect(isLinearBezierCurve({ startPoint })).toBeFalsy();
  expect(isLinearBezierCurve({ endPoint })).toBeFalsy();

  // points missing coordinates
  curve = { startPoint: { x: 1, y: 2 }, endPoint: { x: 3, y: 4 } };
  expect(
    isLinearBezierCurve({ ...curve, startPoint: { x: 6 } })
  ).toBeFalsy();
  expect(
    isLinearBezierCurve({ ...curve, endPoint: { y: 20 } })
  ).toBeFalsy();
});
