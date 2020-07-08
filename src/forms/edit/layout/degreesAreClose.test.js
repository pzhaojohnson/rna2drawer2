import degreesAreClose from './degreesAreClose';

it('degrees are far away', () => {
  expect(degreesAreClose(20, -60)).toBeFalsy();
  expect(degreesAreClose(120, 570)).toBeFalsy();
  expect(degreesAreClose(-220, -400)).toBeFalsy();
});

describe('degrees are close', () => {
  it('degree 1 is clockwise to degree 2', () => {
    let d1 = 36 + (2 * 360) - 1e-8;
    let d2 = 36;
    expect(degreesAreClose(d1, d2)).toBeTruthy();
    expect(degreesAreClose(d1, d2, 8)).toBeFalsy();
    expect(degreesAreClose(d1, d2, 7)).toBeTruthy();

    d1 = 0 - (5 * 360) - 1e-6;
    d2 = 360;
    expect(degreesAreClose(d1, d2)).toBeTruthy();
    expect(degreesAreClose(d1, d2, 6)).toBeFalsy();
    expect(degreesAreClose(d1, d2, 5)).toBeTruthy();

    d1 = 280 + (12 * 360) - 1e-9;
    d2 = 280 - (3 * 360);
    expect(degreesAreClose(d1, d2)).toBeTruthy();
    expect(degreesAreClose(d1, d2, 9)).toBeFalsy();
    expect(degreesAreClose(d1, d2, 8)).toBeTruthy();
  });

  it('degree 2 is clockwise to degree 1', () => {
    let d1 = 88 + (6 * 360) + 1e-5;
    let d2 = 88;
    expect(degreesAreClose(d1, d2)).toBeTruthy();
    expect(degreesAreClose(d1, d2, 5)).toBeFalsy();
    expect(degreesAreClose(d1, d2, 4)).toBeTruthy();

    d1 = 0 + (2 * 360) + 1e-8;
    d2 = 0;
    expect(degreesAreClose(d1, d2)).toBeTruthy();
    expect(degreesAreClose(d1, d2, 8)).toBeFalsy();
    expect(degreesAreClose(d1, d2, 7)).toBeTruthy();

    d1 = 300 - (9 * 360) + 1e-6;
    d2 = 300 + (3 * 360);
    expect(degreesAreClose(d1, d2)).toBeTruthy();
    expect(degreesAreClose(d1, d2, 6)).toBeFalsy();
    expect(degreesAreClose(d1, d2, 5)).toBeTruthy();
  });
});
