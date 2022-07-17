import { containingStem } from './containing';

describe('containingStem function', () => {
  describe('position is in a stem', () => {
    it('a hairpin', () => {
      let partners = [null, null, 11, 10, 9, null, undefined, null, 5, 4, 3, null, undefined];
      [3, 4, 5, 9, 10, 11].forEach(p => {
        expect(containingStem(partners, p)).toStrictEqual(
          { position5: 3, position3: 11, size: 3 }
        );
      });
    });

    it('neighboring stems', () => {
      let partners = [4, 3, 2, 1, 10, 9, null, null, 6, 5, 14, 13, 12, 11];
      [5, 6, 9, 10].forEach(p => {
        expect(containingStem(partners, p)).toStrictEqual(
          { position5: 5, position3: 10, size: 2 }
        );
      });
    });

    it('inner stems', () => {
      let partners = [16, 15, 14, 13, 8, 7, 6, 5, 12, 11, 10, 9, 4, 3, 2, 1];
      [1, 2, 3, 4, 13, 14, 15, 16].forEach(p => {
        expect(containingStem(partners, p)).toStrictEqual(
          { position5: 1, position3: 16, size: 4 }
        );
      });
    });

    it('stem of size one', () => {
      let partners = [undefined, 5, null, undefined, 2, null];
      [2, 5].forEach(p => {
        expect(containingStem(partners, p)).toStrictEqual(
          { position5: 2, position3: 5, size: 1 }
        );
      });
    });

    it('hairpin loop of size zero', () => {
      let partners = [6, 5, 4, 3, 2, 1];
      [1, 2, 3, 4, 5, 6].forEach(p => {
        expect(containingStem(partners, p)).toStrictEqual(
          { position5: 1, position3: 6, size: 3 }
        );
      });
    });

    it("stem is at the 5' end", () => {
      let partners = [9, 8, 7, undefined, null, null, 3, 2, 1, undefined, null];
      [1, 2, 3, 7, 8, 9].forEach(p => {
        expect(containingStem(partners, p)).toStrictEqual(
          { position5: 1, position3: 9, size: 3 }
        );
      });
    });

    it("stem is at the 3' end", () => {
      let partners = [null, undefined, 8, 7, null, null, 4, 3];
      [3, 4, 7, 8].forEach(p => {
        expect(containingStem(partners, p)).toStrictEqual(
          { position5: 3, position3: 8, size: 2 }
        );
      });
    });
  });

  it("position isn't in a stem", () => {
    let partners = [undefined, null, 8, 7, undefined, null, 4, 3, null];
    [1, 2, 5, 6, 9].forEach(p => {
      expect(containingStem(partners, p)).toBeFalsy();
    });
  });

  describe('position is invalid', () => {
    let partners = [6, 5, null, null, 2, 1, undefined, undefined];

    it('out of bounds position', () => {
      [
        0, // zero
        -2, // negative
        partners.length + 1, // just beyond partners length
        partners.length + 8, // well beyond partners length
      ].forEach(p => {
        expect(containingStem(partners, p)).toBeFalsy();
      });
    });

    it('non-integer position', () => {
      [1.001, 2.2, 1.99].forEach(p => {
        expect(containingStem(partners, p)).toBeFalsy();
      });
    });

    it('nonfinite position', () => {
      [NaN, Infinity, -Infinity].forEach(p => {
        expect(containingStem(partners, p)).toBeFalsy();
      });
    });
  });
});
