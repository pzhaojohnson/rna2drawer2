import isAllWhitespace from './isAllWhitespace';

it('isAllWhitespace', () => {
  
  // no whitespace
  expect(isAllWhitespace('asdf')).toBeFalsy();

  // only whitespace
  expect(isAllWhitespace(' \r\n\t  \t\t \n\n \r')).toBeTruthy();

  // some whitespace
  expect(isAllWhitespace('\n\n  \t\t a \nd \t\t \r\r   \n')).toBeFalsy();

  // empty string
  expect(isAllWhitespace('')).toBeTruthy();
});
