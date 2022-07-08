import { stemContainsPosition } from './stemContainsPosition';

describe('stemContainsPosition function', () => {
  test('stem of size greater than one', () => {
    let st = { position5: 12, position3: 45, size: 3 };

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

  test('stem of size one', () => {
    let st = { position5: 20, position3: 31, size: 1 };

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

  test('invalid positions', () => {
    let st = { position5: 6, position3: 30, size: 6 };
    expect(stemContainsPosition(st, 0)).toBeFalsy(); // zero
    expect(stemContainsPosition(st, -1)).toBeFalsy(); // negative
    // nonfinite
    expect(stemContainsPosition(st, NaN)).toBeFalsy();
    expect(stemContainsPosition(st, Infinity)).toBeFalsy();
    expect(stemContainsPosition(st, -Infinity)).toBeFalsy();
  });
});
