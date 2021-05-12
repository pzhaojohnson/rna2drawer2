import { contains } from './UnpairedRegion';

it('contains function', () => {
  let ur = { boundingPosition5: 5, boundingPosition3: 9 };
  
  // contains
  expect(contains(ur, 6)).toBeTruthy();
  expect(contains(ur, 7)).toBeTruthy();
  expect(contains(ur, 8)).toBeTruthy();
  
  // just outside edges
  expect(contains(ur, 5)).toBeFalsy();
  expect(contains(ur, 9)).toBeFalsy();

  // further outside
  expect(contains(ur, 2)).toBeFalsy();
  expect(contains(ur, 50)).toBeFalsy();

  expect(contains(ur, 0)).toBeFalsy(); // zero
  expect(contains(ur, -1)).toBeFalsy(); // negative

  // nonfinite
  expect(contains(ur, NaN)).toBeFalsy();
  expect(contains(ur, Infinity)).toBeFalsy();
  expect(contains(ur, -Infinity)).toBeFalsy();
});
