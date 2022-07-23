import { isString } from './isString';

test('isString function', () => {
  expect(isString('')).toBeTruthy(); // a falsy string
  expect(isString('qwer')).toBeTruthy(); // a truthy string
  expect(isString(1)).toBeFalsy();
  expect(isString(true)).toBeFalsy();
  expect(isString({})).toBeFalsy();
  expect(isString(null)).toBeFalsy();
  expect(isString(undefined)).toBeFalsy();
});
