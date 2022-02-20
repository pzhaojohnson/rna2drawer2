import { compareNumbersAscending } from './sort';
import { compareNumbersDescending } from './sort';
import { compareStringsAscending } from './sort';
import { compareStringsDescending } from './sort';

test('compareNumbersAscending function', () => {
  expect(compareNumbersAscending(0.4, 0.5)).toBeLessThan(0);
  expect(compareNumbersAscending(0.5, 0.5)).toBe(0);
  expect(compareNumbersAscending(0.6, 0.5)).toBeGreaterThan(0);
});

test('compareNumbersDescending function', () => {
  expect(compareNumbersDescending(2.2, 2.3)).toBeGreaterThan(0);
  expect(compareNumbersDescending(2.3, 2.3)).toBe(-0); // can be negative zero
  expect(compareNumbersDescending(2.4, 2.3)).toBeLessThan(0);
});

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
