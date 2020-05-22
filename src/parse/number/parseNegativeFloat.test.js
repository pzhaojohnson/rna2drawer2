import parseNegativeFloat from './parseNegativeFloat';

it('returns null for empty string', () => {
  expect(parseNegativeFloat('')).toBe(null);
});

it('returns null for all whitespace', () => {
  expect(parseNegativeFloat(' ')).toBe(null);
  expect(parseNegativeFloat(' \t')).toBe(null);
});

it('returns null for not a number', () => {
  expect(parseNegativeFloat('asdf')).toBe(null);
});

it('returns null for zero', () => {
  expect(parseNegativeFloat('0')).toBe(null);
});

it('returns null for positive numbers', () => {
  expect(parseNegativeFloat('1.2')).toBe(null);
});

it('returns negative numbers', () => {
  expect(parseNegativeFloat('-7.3')).toBe(-7.3);
});

it('handles extra whitespace', () => {
  expect(parseNegativeFloat('  -0.02  \t')).toBe(-0.02);
});
