import parsePositiveFloat from './parsePositiveFloat';

it('returns null for non-numbers', () => {
  expect(parsePositiveFloat('asdf')).toBe(null);
  expect(parsePositiveFloat('a1.2')).toBe(null);
});

it('returns null for negative numbers', () => {
  expect(parsePositiveFloat('-0.01')).toBe(null);
  expect(parsePositiveFloat('-10')).toBe(null);
});

it('returns null for zero', () => {
  expect(parsePositiveFloat('0')).toBe(null);
});

it('returns positive numbers', () => {
  expect(parsePositiveFloat('0.05')).toBe(0.05);
  expect(parsePositiveFloat('48')).toBe(48);
});

it('handles extra whitespace', () => {
  expect(parsePositiveFloat('  3.6  ')).toBe(3.6);
});

it('returns null for empty string and all whitespace', () => {
  expect(parsePositiveFloat('')).toBe(null);
  expect(parsePositiveFloat('  ')).toBe(null);
});
