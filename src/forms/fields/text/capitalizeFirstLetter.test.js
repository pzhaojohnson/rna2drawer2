import capitalizeFirstLetter from './capitalizeFirstLetter';

it('string of length zero', () => {
  expect(capitalizeFirstLetter('')).toBe('');
});

it('string of length one', () => {
  expect(capitalizeFirstLetter('g')).toBe('G');
});

it('string of length greater than one', () => {
  // capitalizes first letter and maintains rest of string
  expect(capitalizeFirstLetter('dasEo13 cMn')).toBe('DasEo13 cMn');
});

it('first character is not a letter', () => {
  expect(capitalizeFirstLetter('1asdf')).toBe('1asdf');
});
