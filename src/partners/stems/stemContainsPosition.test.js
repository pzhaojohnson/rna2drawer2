import { createStem } from 'Partners/stems/Stem';

import { stemContainsPosition } from './stemContainsPosition';

describe('stemContainsPosition function', () => {
  test('a stem with just one pair', () => {
    let stem = createStem({ bottomPair: [20, 31], numPairs: 1 });

    // contained
    expect(stemContainsPosition(stem, 20)).toBeTruthy();
    expect(stemContainsPosition(stem, 31)).toBeTruthy();

    // just outside edges
    expect(stemContainsPosition(stem, 19)).toBeFalsy();
    expect(stemContainsPosition(stem, 21)).toBeFalsy();
    expect(stemContainsPosition(stem, 32)).toBeFalsy();
    expect(stemContainsPosition(stem, 30)).toBeFalsy();

    // further outside
    expect(stemContainsPosition(stem, 6)).toBeFalsy();
    expect(stemContainsPosition(stem, 27)).toBeFalsy();
    expect(stemContainsPosition(stem, 42)).toBeFalsy();
  });

  test('a stem with more than one pair', () => {
    let stem = createStem({ bottomPair: [45, 12], numPairs: 3 });

    // contained
    expect(stemContainsPosition(stem, 12)).toBeTruthy();
    expect(stemContainsPosition(stem, 13)).toBeTruthy();
    expect(stemContainsPosition(stem, 14)).toBeTruthy();
    expect(stemContainsPosition(stem, 45)).toBeTruthy();
    expect(stemContainsPosition(stem, 44)).toBeTruthy();
    expect(stemContainsPosition(stem, 43)).toBeTruthy();

    // just outside edges
    expect(stemContainsPosition(stem, 11)).toBeFalsy();
    expect(stemContainsPosition(stem, 15)).toBeFalsy();
    expect(stemContainsPosition(stem, 46)).toBeFalsy();
    expect(stemContainsPosition(stem, 42)).toBeFalsy();

    // further outside
    expect(stemContainsPosition(stem, 3)).toBeFalsy();
    expect(stemContainsPosition(stem, 26)).toBeFalsy();
    expect(stemContainsPosition(stem, 88)).toBeFalsy();
  });

  test('invalid positions', () => {
    let stem = createStem({ bottomPair: [6, 30], numPairs: 6 });

    expect(stemContainsPosition(stem, 0)).toBeFalsy(); // zero
    expect(stemContainsPosition(stem, -1)).toBeFalsy(); // negative

    // nonfinite
    expect(stemContainsPosition(stem, NaN)).toBeFalsy();
    expect(stemContainsPosition(stem, Infinity)).toBeFalsy();
    expect(stemContainsPosition(stem, -Infinity)).toBeFalsy();
  });
});
