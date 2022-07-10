import { isPaired } from './isPaired';
import { isUnpaired } from './isPaired';
import { arePaired } from './isPaired';

let partners = [null, undefined, 11, 10, 9, null, undefined, undefined, 5, 4, 3, null];

describe('isPaired function', () => {
  test('positions that are in range', () => {
    expect(isPaired(partners, 4)).toBeTruthy(); // upstream partner
    expect(isPaired(partners, 11)).toBeTruthy(); // downstream partner
    expect(isPaired(partners, 6)).toBeFalsy(); // null
    expect(isPaired(partners, 2)).toBeFalsy(); // undefined
  });

  test('positions that are out of range', () => {
    // since the position is out of range, it cannot be paired
    expect(isPaired(partners, 0)).toBeFalsy();
    expect(isPaired(partners, -1)).toBeFalsy();
    expect(isPaired(partners, partners.length + 2)).toBeFalsy();
  });
});

describe('isUnpaired function', () => {
  test('positions that are in range', () => {
    expect(isUnpaired(partners, 4)).toBeFalsy(); // upstream partner
    expect(isUnpaired(partners, 11)).toBeFalsy(); // downstream partner
    expect(isUnpaired(partners, 6)).toBeTruthy(); // null
    expect(isUnpaired(partners, 2)).toBeTruthy(); // undefined
  });

  test('positions that are out of range', () => {
    // since the position is out of range, it cannot be paired
    // (and therefore is unpaired)
    expect(isUnpaired(partners, 0)).toBeTruthy();
    expect(isUnpaired(partners, -1)).toBeTruthy();
    expect(isUnpaired(partners, partners.length + 3)).toBeTruthy();
  });
});

describe('arePaired function', () => {
  let partners = [null, undefined, 11, 10, 9, null, undefined, undefined, 5, 4, 3, null];

  test('when the two positions are paired', () => {
    expect(arePaired(partners, 3, 11)).toBeTruthy();
    expect(arePaired(partners, 4, 10)).toBeTruthy();
    expect(arePaired(partners, 9, 5)).toBeTruthy(); // larger position is first
  });

  test('when the two positions are unpaired', () => {
    expect(arePaired(partners, 1, 6)).toBeFalsy();
    expect(arePaired(partners, 12, 6)).toBeFalsy();
  });

  test('when the two positions are in different pairs', () => {
    // first position is in other pair
    expect(arePaired(partners, 3, 6)).toBeFalsy();
    // second position is in other pair
    expect(arePaired(partners, 6, 9)).toBeFalsy();
    // both positions are in other pairs
    expect(arePaired(partners, 3, 10)).toBeFalsy();
  });

  test('positions that are out of range', () => {
    // first is below range and second is above range
    expect(arePaired(partners, -2, partners.length + 2)).toBeFalsy();
    // first is above range and second is below range
    expect(arePaired(partners, partners.length + 3, -5)).toBeFalsy();
  });
});
