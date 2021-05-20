import {
  partnerOf,
  unstructuredPartners,
} from './Partners';

describe('partnerOf function', () => {
  let partners = [null, undefined, 11, 10, 9, null, undefined, undefined, 5, 4, 3, null];

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

describe('unstructuredPartners function', () => {
  it('creates empty partners by default', () => {
    expect(unstructuredPartners()).toStrictEqual([]);
  });

  it('creates partners of specified length', () => {
    expect(unstructuredPartners(2)).toStrictEqual(
      [null, null]
    );
    expect(unstructuredPartners(5)).toStrictEqual(
      [null, null, null, null, null]
    );
  });
});
