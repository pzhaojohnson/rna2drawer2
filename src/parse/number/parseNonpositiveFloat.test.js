import parseNonpositiveFloat from './parseNonpositiveFloat';

it('returns null for empty string', () => {
  expect(parseNonpositiveFloat('')).toBe(null);
});

it('returns null for all whitespace', () => {
  expect(parseNonpositiveFloat(' ')).toBe(null);
  expect(parseNonpositiveFloat(' \t')).toBe(null);
});

it('returns null for not a number', () => {
  expect(parseNonpositiveFloat('asdf')).toBe(null);
});

it('returns zero', () => {
  expect(parseNonpositiveFloat('0')).toBe(0);
});

it('returns null for positive numbers', () => {
  expect(parseNonpositiveFloat('1.2')).toBe(null);
});

it('returns negative numbers', () => {
  expect(parseNonpositiveFloat('-7.3')).toBe(-7.3);
});

it('handles extra whitespace', () => {
  expect(parseNonpositiveFloat('  -0.02  \t')).toBe(-0.02);
});
