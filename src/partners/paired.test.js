import {
  partnerOf,
  isPaired,
  isUnpaired,
} from './paired';

let partners = [null, undefined, 11, 10, 9, null, undefined, undefined, 5, 4, 3, null];

describe('partnerOf function', () => {
  it('position is in range', () => {
    expect(partnerOf(partners, 1)).toBe(null);
    expect(partnerOf(partners, 2)).toBe(undefined);
    expect(partnerOf(partners, 3)).toBe(11);
    expect(partnerOf(partners, 5)).toBe(9);
    expect(partnerOf(partners, 7)).toBe(undefined);
    expect(partnerOf(partners, 10)).toBe(4);
    expect(partnerOf(partners, 12)).toBe(null);
  });

  it('position is out of range', () => {
    expect(partnerOf(partners, 0)).toBe(undefined);
    expect(partnerOf(partners, -1)).toBe(undefined);
    expect(partnerOf(partners, partners.length + 5)).toBe(undefined);
  });
});

describe('isPaired function', () => {
  it('position is in range', () => {
    expect(isPaired(partners, 4)).toBeTruthy(); // upstream partner
    expect(isPaired(partners, 11)).toBeTruthy(); // downstream partner
    expect(isPaired(partners, 6)).toBeFalsy(); // null
    expect(isPaired(partners, 2)).toBeFalsy(); // undefined
  });

  it('position is out of range', () => {
    // since the position is out of range, it cannot
    // be paired
    expect(isPaired(partners, 0)).toBeFalsy();
    expect(isPaired(partners, -1)).toBeFalsy();
    expect(isPaired(partners, partners.length + 2)).toBeFalsy();
  });
});

describe('isUnpaired function', () => {
  it('position is in range', () => {
    expect(isUnpaired(partners, 4)).toBeFalsy(); // upstream partner
    expect(isUnpaired(partners, 11)).toBeFalsy(); // downstream partner
    expect(isUnpaired(partners, 6)).toBeTruthy(); // null
    expect(isUnpaired(partners, 2)).toBeTruthy(); // undefined
  });

  it('position is out of range', () => {
    // since the position is out of range, it cannot
    // be paired and therefore is unpaired
    expect(isUnpaired(partners, 0)).toBeTruthy();
    expect(isUnpaired(partners, -1)).toBeTruthy();
    expect(isUnpaired(partners, partners.length + 3)).toBeTruthy();
  });
});
