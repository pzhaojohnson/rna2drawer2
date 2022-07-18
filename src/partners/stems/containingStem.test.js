import { createStem } from 'Partners/stems/Stem';

import { containingStem } from './containingStem';

describe('containingStem function', () => {
  test('inputting a position object', () => {
    let partners = [9, 8, 7, null, null, null, 3, 2, 1];
    expect(containingStem(partners, { position: 5 })).toBeUndefined();
    expect(containingStem(partners, { position: 2 })).toStrictEqual(
      createStem({ bottomPair: [1, 9], numPairs: 3 })
    );
  });

  describe('when a position is in a stem', () => {
    test('a hairpin whose neighboring positions are unpaired', () => {
      let partners = [null, null, 11, 10, 9, null, undefined, null, 5, 4, 3, null, undefined];
      [3, 4, 5, 9, 10, 11].forEach(p => {
        expect(containingStem(partners, p)).toStrictEqual(
          createStem({ bottomPair: [3, 11], numPairs: 3 })
        );
      });
    });

    test('a hairpin whose neighboring positions are paired', () => {
      let partners = [4, 3, 2, 1, 10, 9, null, null, 6, 5, 14, 13, 12, 11];
      [5, 6, 9, 10].forEach(p => {
        expect(containingStem(partners, p)).toStrictEqual(
          createStem({ bottomPair: [5, 10], numPairs: 2 })
        );
      });
    });

    test('a stem that encloses two other stems', () => {
      let partners = [16, 15, 14, 13, 8, 7, 6, 5, 12, 11, 10, 9, 4, 3, 2, 1];
      [1, 2, 3, 4, 13, 14, 15, 16].forEach(p => {
        expect(containingStem(partners, p)).toStrictEqual(
          createStem({ bottomPair: [1, 16], numPairs: 4 })
        );
      });
    });

    test('a stem containing one pair', () => {
      let partners = [undefined, 5, null, undefined, 2, null];
      [2, 5].forEach(p => {
        expect(containingStem(partners, p)).toStrictEqual(
          createStem({ bottomPair: [2, 5], numPairs: 1 })
        );
      });
    });

    test('a hairpin with no unpaired positions in its loop', () => {
      let partners = [6, 5, 4, 3, 2, 1];
      [1, 2, 3, 4, 5, 6].forEach(p => {
        expect(containingStem(partners, p)).toStrictEqual(
          createStem({ bottomPair: [1, 6], numPairs: 3 })
        );
      });
    });

    test('a stem at the very beginning of the structure', () => {
      let partners = [9, 8, 7, undefined, null, null, 3, 2, 1, undefined, null];
      [1, 2, 3, 7, 8, 9].forEach(p => {
        expect(containingStem(partners, p)).toStrictEqual(
          createStem({ bottomPair: [1, 9], numPairs: 3 })
        );
      });
    });

    test('a stem at the very end of the structure', () => {
      let partners = [null, undefined, 8, 7, null, null, 4, 3];
      [3, 4, 7, 8].forEach(p => {
        expect(containingStem(partners, p)).toStrictEqual(
          createStem({ bottomPair: [3, 8], numPairs: 2 })
        );
      });
    });
  });

  test('when a position is not in a stem', () => {
    let partners = [undefined, null, 8, 7, undefined, null, 4, 3, null];
    [1, 2, 5, 6, 9].forEach(p => {
      expect(containingStem(partners, p)).toBeUndefined();
    });
  });

  describe('when a position is invalid', () => {
    test('out of range positions', () => {
      let partners = [6, 5, null, null, 2, 1, undefined, undefined];
      [
        0, // zero
        -2, // negative
        9, // just beyond partners length
        16, // well beyond partners length
      ].forEach(p => {
        expect(containingStem(partners, p)).toBeUndefined();
      });
    });

    test('non-integer positions', () => {
      let partners = [6, 5, null, null, 2, 1, undefined, undefined];
      [1.001, 2.2, 1.99].forEach(p => {
        expect(containingStem(partners, p)).toBeUndefined();
      });
    });

    test('nonfinite positions', () => {
      let partners = [6, 5, null, null, 2, 1, undefined, undefined];
      [NaN, Infinity, -Infinity].forEach(p => {
        expect(containingStem(partners, p)).toBeUndefined();
      });
    });
  });
});
