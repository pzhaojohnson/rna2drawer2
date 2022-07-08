import { createStem } from 'Partners/stems/Stem';

import { stemContainsPosition } from './stemContainsPosition';

describe('stemContainsPosition function', () => {
  test('a stem with just one pair', () => {
    let st = createStem({ bottomPair: [20, 31], numPairs: 1 });

    // contained
    expect(stemContainsPosition(st, 20)).toBeTruthy();
    expect(stemContainsPosition(st, 31)).toBeTruthy();

    // just outside edges
    expect(stemContainsPosition(st, 19)).toBeFalsy();
    expect(stemContainsPosition(st, 21)).toBeFalsy();
    expect(stemContainsPosition(st, 32)).toBeFalsy();
    expect(stemContainsPosition(st, 30)).toBeFalsy();

    // further outside
    expect(stemContainsPosition(st, 6)).toBeFalsy();
    expect(stemContainsPosition(st, 27)).toBeFalsy();
    expect(stemContainsPosition(st, 42)).toBeFalsy();
  });

  test('a stem with more than one pair', () => {
    let st = createStem({ bottomPair: [45, 12], numPairs: 3 });

    // contained
    expect(stemContainsPosition(st, 12)).toBeTruthy();
    expect(stemContainsPosition(st, 13)).toBeTruthy();
    expect(stemContainsPosition(st, 14)).toBeTruthy();
    expect(stemContainsPosition(st, 45)).toBeTruthy();
    expect(stemContainsPosition(st, 44)).toBeTruthy();
    expect(stemContainsPosition(st, 43)).toBeTruthy();

    // just outside edges
    expect(stemContainsPosition(st, 11)).toBeFalsy();
    expect(stemContainsPosition(st, 15)).toBeFalsy();
    expect(stemContainsPosition(st, 46)).toBeFalsy();
    expect(stemContainsPosition(st, 42)).toBeFalsy();

    // further outside
    expect(stemContainsPosition(st, 3)).toBeFalsy();
    expect(stemContainsPosition(st, 26)).toBeFalsy();
    expect(stemContainsPosition(st, 88)).toBeFalsy();
  });

  test('invalid positions', () => {
    let st = createStem({ bottomPair: [6, 30], numPairs: 6 });
    expect(stemContainsPosition(st, 0)).toBeFalsy(); // zero
    expect(stemContainsPosition(st, -1)).toBeFalsy(); // negative
    // nonfinite
    expect(stemContainsPosition(st, NaN)).toBeFalsy();
    expect(stemContainsPosition(st, Infinity)).toBeFalsy();
    expect(stemContainsPosition(st, -Infinity)).toBeFalsy();
  });
});
