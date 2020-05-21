import parseNonnegativeFloat from './parseNonnegativeFloat';

it('returns null for non-numbers', () => {
  expect(parseNonnegativeFloat('asdf')).toBe(null);
  expect(parseNonnegativeFloat('a1.2')).toBe(null);
});

it('returns null for negative numbers', () => {
  expect(parseNonnegativeFloat('-0.01')).toBe(null);
  expect(parseNonnegativeFloat('-10')).toBe(null);
});

it('can return zero', () => {
  expect(parseNonnegativeFloat('0')).toBe(0);
});

it('returns positive numbers', () => {
  expect(parseNonnegativeFloat('0.05')).toBe(0.05);
  expect(parseNonnegativeFloat('48')).toBe(48);
});

it('handles extra whitespace', () => {
  expect(parseNonnegativeFloat('  3.6  ')).toBe(3.6);
});

it('returns null for empty string and all whitespace', () => {
  expect(parseNonnegativeFloat('')).toBe(null);
  expect(parseNonnegativeFloat('  ')).toBe(null);
});
