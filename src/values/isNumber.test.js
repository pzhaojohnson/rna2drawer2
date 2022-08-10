import { isNumber } from './isNumber';

test('isNumber function', () => {
  expect(isNumber(0)).toBeTruthy(); // a falsy number
  expect(isNumber(227)).toBeTruthy(); // a truthy number
  expect(isNumber('asdf')).toBeFalsy();
  expect(isNumber(true)).toBeFalsy();
  expect(isNumber({})).toBeFalsy();
  expect(isNumber(null)).toBeFalsy();
  expect(isNumber(undefined)).toBeFalsy();
});
