import parseNonemptyFloat from './parseNonemptyFloat';

it('returns null for empty string', () => {
  expect(parseNonemptyFloat('')).toBe(null);
});

it('returns null for all whitespace', () => {
  expect(parseNonemptyFloat(' ')).toBe(null);
  expect(parseNonemptyFloat(' \t ')).toBe(null);
});

it('returns null for not a number', () => {
  expect(parseNonemptyFloat('a1')).toBe(null);
  expect(parseNonemptyFloat('asdf')).toBe(null);
});

it('returns a parsable number', () => {
  expect(parseNonemptyFloat('12')).toBe(12);
  expect(parseNonemptyFloat('-0.087')).toBe(-0.087);
});

it('handles extra whitespace', () => {
  expect(parseNonemptyFloat('  1.2  \t')).toBe(1.2);
});
