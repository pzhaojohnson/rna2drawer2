import { isNullish } from './isNullish';

test('isNullish function', () => {
  // nullish values
  expect(isNullish(null)).toBeTruthy();
  expect(isNullish(undefined)).toBeTruthy();

  // truthy and falsy numbers
  expect(isNullish(1)).toBeFalsy();
  expect(isNullish(0)).toBeFalsy();

  // truthy and falsy strings
  expect(isNullish('asdf')).toBeFalsy();
  expect(isNullish('')).toBeFalsy();

  // true and false
  expect(isNullish(true)).toBeFalsy();
  expect(isNullish(false)).toBeFalsy();

  // an object
  expect(isNullish({})).toBeFalsy();
});
