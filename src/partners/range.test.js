import { positionIsInRange } from './range';
import { positionIsOutOfRange } from './range';

describe('positionIsInRange and positionIsOutOfRange functions', () => {
  let partners = [6, 5, null, null, 2, 1, undefined, undefined];

  it('integer positions', () => {
    let areInBounds = [
      1, // the very first position
      partners.length, // the very last position
      3, // in the middle
    ];
    // check that position 3 is in the middle
    expect(partners.length).toBeGreaterThan(3);
    areInBounds.forEach(p => {
      expect(positionIsInRange(partners, p)).toBeTruthy();
      expect(positionIsOutOfRange(partners, p)).toBeFalsy();
    });

    let areOutOfBounds = [
      0, // zero
      -2, // negative
      partners.length + 1, // just beyond partners length
      partners.length + 6, // well beyond partners length
    ];
    areOutOfBounds.forEach(p => {
      expect(positionIsInRange(partners, p)).toBeFalsy();
      expect(positionIsOutOfRange(partners, p)).toBeTruthy();
    });
  });

  it('non-integer positions', () => {
    [0.99, 1.2, 2.001].forEach(p => {
      expect(positionIsInRange(partners, p)).toBeFalsy();
      expect(positionIsOutOfRange(partners, p)).toBeTruthy();
    });
  });

  it('nonfinite positions', () => {
    [NaN, Infinity, -Infinity].forEach(p => {
      expect(positionIsInRange(partners, p)).toBeFalsy();
      expect(positionIsOutOfRange(partners, p)).toBeTruthy();
    });
  });

  it('empty partners', () => {
    let partners = [];
    expect(positionIsInRange(partners, 1)).toBeFalsy();
    expect(positionIsOutOfRange(partners, 1)).toBeTruthy();
  });

  it('unassigned positions in partners', () => {
    let partners = [null, null, null];
    // partners length is now 19
    partners[18] = undefined;

    // an unassigned position
    expect(positionIsInRange(partners, 15)).toBeTruthy();
    expect(positionIsOutOfRange(partners, 15)).toBeFalsy();

    // the partners length
    expect(positionIsInRange(partners, 19)).toBeTruthy();
    expect(positionIsOutOfRange(partners, 19)).toBeFalsy();

    // just beyond partners length
    expect(positionIsInRange(partners, 20)).toBeFalsy();
    expect(positionIsOutOfRange(partners, 20)).toBeTruthy();
  });
});
