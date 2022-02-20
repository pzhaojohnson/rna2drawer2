import { compareStringsAscending } from './sort';
import { compareStringsDescending } from './sort';

test('compareStringsAscending function', () => {
  expect(compareStringsAscending('B', 'G')).toBeLessThan(0);
  expect(compareStringsAscending('G', 'G')).toBe(0);
  expect(compareStringsAscending('J', 'G')).toBeGreaterThan(0);
});

test('compareStringsDescending function', () => {
  expect(compareStringsDescending('C', 'K')).toBeGreaterThan(0);
  expect(compareStringsDescending('K', 'K')).toBe(-0); // can be negative zero
  expect(compareStringsDescending('Q', 'K')).toBeLessThan(0);
});
