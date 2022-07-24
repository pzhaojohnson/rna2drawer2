import { isPoint2D } from './Point';
import { deepCopyPoint2D } from './Point';

test('isPoint2D function', () => {
  // actual 2D points
  expect(isPoint2D({ x: -1, y: 2 })).toBeTruthy();
  expect(isPoint2D({ x: 58.9, y: -23.7 })).toBeTruthy();

  // non-object values
  expect(isPoint2D(1)).toBeFalsy();
  expect(isPoint2D('asdf')).toBeFalsy();
  expect(isPoint2D(true)).toBeFalsy();
  expect(isPoint2D(null)).toBeFalsy();
  expect(isPoint2D(undefined)).toBeFalsy();

  // empty object
  expect(isPoint2D({})).toBeFalsy();

  // missing a coordinate
  expect(isPoint2D({ x: 5 })).toBeFalsy();
  expect(isPoint2D({ y: 8 })).toBeFalsy();

  // one coordinate is the wrong type
  expect(isPoint2D({ x: '9', y: 1 })).toBeFalsy();
  expect(isPoint2D({ x: 2, y: '10' })).toBeFalsy();
});

test('deepCopyPoint2D function', () => {
  let p1 = { x: -311.7, y: 812.5 };
  let p2 = deepCopyPoint2D(p1);
  expect(p2).not.toBe(p1); // is a new point
  expect(p2).toStrictEqual(p1);
});
