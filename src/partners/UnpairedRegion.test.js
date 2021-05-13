import {
  size,
  positions,
  contains,
} from './UnpairedRegion';

it('size function', () => {
  // size greater than zero
  let ur = { boundingPosition5: 101, boundingPosition3: 112 };
  expect(size(ur)).toBe(10);
  // size of zero
  ur = { boundingPosition5: 66, boundingPosition3: 67 };
  expect(size(ur)).toBe(0);
});

describe('positions function', () => {
  it('unpaired region containing multiple positions', () => {
    let ur = { boundingPosition5: 22, boundingPosition3: 27 };
    expect(positions(ur)).toStrictEqual([23, 24, 25, 26]);
  });

  it('unpaired region containing zero positions', () => {
    let ur = { boundingPosition5: 8, boundingPosition3: 9 };
    expect(positions(ur)).toStrictEqual([]);
  });
});

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
