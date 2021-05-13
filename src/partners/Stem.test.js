import {
  bottomPair,
  topPair,
  contains,
} from './Stem';

it('bottomPair function', () => {
  let st = { position5: 24, position3: 76, size: 6 };
  expect(bottomPair(st)).toStrictEqual([24, 76]);
});

it('topPair function', () => {
  // size greater than one
  let st = { position5: 12, position3: 33, size: 5 };
  expect(topPair(st)).toStrictEqual([16, 29]);
  // size of one
  st = { position5: 18, position3: 26, size: 1 };
  expect(topPair(st)).toStrictEqual([18, 26]);
});

describe('contains function', () => {
  it('stem of size greater than one', () => {
    let st = { position5: 12, position3: 45, size: 3 };
    
    // contained
    expect(contains(st, 12)).toBeTruthy();
    expect(contains(st, 13)).toBeTruthy();
    expect(contains(st, 14)).toBeTruthy();
    expect(contains(st, 45)).toBeTruthy();
    expect(contains(st, 44)).toBeTruthy();
    expect(contains(st, 43)).toBeTruthy();

    // just outside edges
    expect(contains(st, 11)).toBeFalsy();
    expect(contains(st, 15)).toBeFalsy();
    expect(contains(st, 46)).toBeFalsy();
    expect(contains(st, 42)).toBeFalsy();

    // further outside
    expect(contains(st, 3)).toBeFalsy();
    expect(contains(st, 26)).toBeFalsy();
    expect(contains(st, 88)).toBeFalsy();
  });

  it('stem of size one', () => {
    let st = { position5: 20, position3: 31, size: 1 };

    // contained
    expect(contains(st, 20)).toBeTruthy();
    expect(contains(st, 31)).toBeTruthy();

    // just outside edges
    expect(contains(st, 19)).toBeFalsy();
    expect(contains(st, 21)).toBeFalsy();
    expect(contains(st, 32)).toBeFalsy();
    expect(contains(st, 30)).toBeFalsy();

    // further outside
    expect(contains(st, 6)).toBeFalsy();
    expect(contains(st, 27)).toBeFalsy();
    expect(contains(st, 42)).toBeFalsy();
  });

  it('invalid positions', () => {
    let st = { position5: 6, position3: 30, size: 6 };
    expect(contains(st, 0)).toBeFalsy(); // zero
    expect(contains(st, -1)).toBeFalsy(); // negative
    // nonfinite
    expect(contains(st, NaN)).toBeFalsy();
    expect(contains(st, Infinity)).toBeFalsy();
    expect(contains(st, -Infinity)).toBeFalsy();
  });
});
