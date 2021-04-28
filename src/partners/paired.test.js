import {
  partnerOf,
  isPaired,
  isUnpaired,
  arePaired,
  areUnstructured,
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

describe('arePaired function', () => {
  let partners = [null, undefined, 11, 10, 9, null, undefined, undefined, 5, 4, 3, null];

  it('are paired', () => {
    expect(arePaired(partners, 3, 11)).toBeTruthy();
    expect(arePaired(partners, 4, 10)).toBeTruthy();
    expect(arePaired(partners, 9, 5)).toBeTruthy(); // larger position is first
  });

  it('both are unpaired', () => {
    expect(arePaired(partners, 1, 6)).toBeFalsy();
    expect(arePaired(partners, 12, 6)).toBeFalsy();
  });

  it('are in other pairs', () => {
    // first position is in other pair
    expect(arePaired(partners, 3, 6)).toBeFalsy();
    // second position is in other pair
    expect(arePaired(partners, 6, 9)).toBeFalsy();
    // both positions are in other pairs
    expect(arePaired(partners, 3, 10)).toBeFalsy();
  });

  it('positions are out of range', () => {
    // first is below range and second is above range
    expect(arePaired(partners, -2, partners.length + 2)).toBeFalsy();
    // first is above range and second is below range
    expect(arePaired(partners, partners.length + 3, -5)).toBeFalsy();
  });
});

describe('areUnstructured function', () => {
  describe('are unstructured', () => {
    it('empty', () => {
      expect(areUnstructured([])).toBeTruthy();
    });

    it('entirely unpaired', () => {
      let partners = [undefined, null, null, undefined, undefined];
      expect(areUnstructured(partners)).toBeTruthy();
    });

    it('has unassigned positions', () => {
      let partners = [null, undefined, null];
      partners[15] = null;
      partners[25] = undefined;
      expect(areUnstructured(partners)).toBeTruthy();
    });
  });

  describe('are structured', () => {
    it('has pairs', () => {
      let partners = [null, 8, 7, undefined, null, undefined, 3, 2];
      expect(areUnstructured(partners)).toBeFalsy();
    });

    it('has unassigned positions', () => {
      let partners = [null, null, undefined];
      partners[16 - 1] = 29;
      partners[29 - 1] = 16;
      partners.length = 50;
      expect(areUnstructured(partners)).toBeFalsy();
    });
  });
});
