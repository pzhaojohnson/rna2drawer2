import { isPoint2D } from './Point';

describe('isPoint2D function', () => {
  it('returns true for 2D points', () => {
    [
      { x: 1, y: 2 },
      { x: 0, y: 0 },
      { x: -100, y: -50.5 },
      { x: 211.4, y: 45.6 },
    ].forEach(p => {
      expect(isPoint2D(p)).toBeTruthy();
    });
  });

  it('returns false if x or y properties are not numeric', () => {
    // empty object
    expect(isPoint2D({})).toBeFalsy();
    [
      undefined,
      null,
      'asdf',
      {},
      true,
    ].forEach(v => {
      // x is not a number
      expect(
        isPoint2D({ x: v, y: 5 })
      ).toBeFalsy();
      // y is not a number
      expect(
        isPoint2D({ x: 5, y: v })
      ).toBeFalsy();
    });
  });
});