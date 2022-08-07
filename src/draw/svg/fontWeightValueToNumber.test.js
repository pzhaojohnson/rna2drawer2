import { fontWeightValueToNumber } from './fontWeightValueToNumber';

test('fontWeightValueToNumber function', () => {
  // keyword font weight values
  expect(fontWeightValueToNumber('normal')).toBe(400);
  expect(fontWeightValueToNumber('bold')).toBe(700);
  expect(fontWeightValueToNumber('bolder')).toBeUndefined();
  expect(fontWeightValueToNumber('lighter')).toBeUndefined();

  // numbers
  expect(fontWeightValueToNumber(400)).toBe(400);
  expect(fontWeightValueToNumber(700)).toBe(700);
  expect(fontWeightValueToNumber(300)).toBe(300);

  // strings of numbers
  expect(fontWeightValueToNumber('400')).toBe(400);
  expect(fontWeightValueToNumber('700')).toBe(700);
  expect(fontWeightValueToNumber('300')).toBe(300);

  // non-numeric strings
  expect(fontWeightValueToNumber('asdf')).toBeUndefined();
  expect(fontWeightValueToNumber('')).toBeUndefined();
  expect(fontWeightValueToNumber('  \t  \n  ')).toBeUndefined();

  // nullish values
  expect(fontWeightValueToNumber(null)).toBeUndefined();
  expect(fontWeightValueToNumber(undefined)).toBeUndefined();
});
