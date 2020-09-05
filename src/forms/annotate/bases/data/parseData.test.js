import { parseData } from './parseData';

it('splits by commas, semicolons and whitespace', () => {
  let rawData = '1 2\t5\n12.2\r-4\r\n6.01,23';
  let data = parseData(rawData);
  expect(data).toStrictEqual([1, 2, 5, 12.2, -4, 6.01, 23]);
});

it('handles whitespace between splitting characters', () => {
  let rawData = '1,2,,5,6,  9, \t\n10.2, 12';
  let data = parseData(rawData);
  expect(data).toStrictEqual([1, 2, 5, 6, 9, 10.2, 12]);
});

it('returns undefined when a value cannot be parsed', () => {
  let rawData = '1,2,3,a,5,10,12.5';
  expect(parseData(rawData)).toBe(undefined);
});

it('an entry cannot be entirely parsed as a number', () => {
  let rawData = '100a';
  let pf = Number.parseFloat(rawData);
  expect(pf).toBe(100); // left side can be parsed
  let n = Number(rawData);
  expect(n).toBe(NaN); // but entire string cannot be parsed
  expect(parseData(rawData)).toBe(undefined);
});
