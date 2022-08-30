import { strokeDasharrayValueEqualsNone } from './strokeDasharrayValueEqualsNone';

test('strokeDasharrayValueEqualsNone function', () => {
  // nullish values
  expect(strokeDasharrayValueEqualsNone(undefined)).toBeTruthy();
  expect(strokeDasharrayValueEqualsNone(null)).toBeTruthy();

  // blank strings
  expect(strokeDasharrayValueEqualsNone('')).toBeTruthy();
  expect(strokeDasharrayValueEqualsNone('   ')).toBeTruthy();
  expect(strokeDasharrayValueEqualsNone('\t\n\r')).toBeTruthy();

  // the string "none" with different casing and extra whitespace
  expect(strokeDasharrayValueEqualsNone('none')).toBeTruthy();
  expect(strokeDasharrayValueEqualsNone('None')).toBeTruthy();
  expect(strokeDasharrayValueEqualsNone('NONE')).toBeTruthy();
  expect(strokeDasharrayValueEqualsNone('  none   ')).toBeTruthy();
  expect(strokeDasharrayValueEqualsNone('\tNone\n\t\r')).toBeTruthy();
  expect(strokeDasharrayValueEqualsNone('no  ne')).toBeFalsy();

  // nonempty string dash arrays
  expect(strokeDasharrayValueEqualsNone('1')).toBeFalsy();
  expect(strokeDasharrayValueEqualsNone('4 2')).toBeFalsy();
  expect(strokeDasharrayValueEqualsNone('  2  2.5  3 41%  ')).toBeFalsy();
  expect(strokeDasharrayValueEqualsNone('2, 3,25%,4.2  ,   6')).toBeFalsy();

  // empty array
  expect(strokeDasharrayValueEqualsNone([])).toBeTruthy();

  // nonempty dash arrays
  expect(strokeDasharrayValueEqualsNone([3])).toBeFalsy();
  expect(strokeDasharrayValueEqualsNone([1, 2])).toBeFalsy();
  expect(strokeDasharrayValueEqualsNone([1.1, 3.3, 5, 12])).toBeFalsy();

  // numbers
  expect(strokeDasharrayValueEqualsNone(1)).toBeFalsy();
  expect(strokeDasharrayValueEqualsNone(0)).toBeFalsy();
  expect(strokeDasharrayValueEqualsNone(-1)).toBeFalsy();

  // some invalid stroke-dasharray values
  expect(strokeDasharrayValueEqualsNone('asdf')).toBeFalsy();
  expect(strokeDasharrayValueEqualsNone(true)).toBeFalsy();
  expect(strokeDasharrayValueEqualsNone(false)).toBeFalsy();
  expect(strokeDasharrayValueEqualsNone({})).toBeFalsy();
});
