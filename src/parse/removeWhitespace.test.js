import removeWhitespace from './removeWhitespace';

it('removeWhitespace', () => {
  
  // no whitespace
  expect(removeWhitespace('asdf')).toBe('asdf');

  // only whitespace
  expect(removeWhitespace('  \t\t\n\r\r\r\n   \t\n\n\n')).toBe('');

  // some whitespace
  expect(removeWhitespace('a  \n\n\t\t\r\r  r nn \t\t\n  ')).toBe('arnn');

  // empty string
  expect(removeWhitespace('')).toBe('');
});
