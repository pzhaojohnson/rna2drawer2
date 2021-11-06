import { isBlank } from './isBlank';

test('isBlank function', () => {

  // no whitespace
  expect(isBlank('asdf')).toBeFalsy();

  // only whitespace
  expect(isBlank(' \r\n\t  \t\t \n\n \r')).toBeTruthy();

  // some whitespace
  expect(isBlank('\n\n  \t\t a \nd \t\t \r\r   \n')).toBeFalsy();

  // empty string
  expect(isBlank('')).toBeTruthy();
});
