import { hasKnots } from './hasKnots';

describe('hasKnots function', () => {
  describe('has no knots', () => {
    it('empty', () => {
      expect(hasKnots([])).toBeFalsy();
    });

    it('unstructured', () => {
      let partners = [undefined, null, null, undefined];
      expect(hasKnots(partners)).toBeFalsy();
    });

    it('a knotless structure', () => {
      let partners = [15, 14, null, 10, 9, undefined, null, null, 5, 4, undefined, null, null, 2, 1];
      expect(hasKnots(partners)).toBeFalsy();
    });

    it('has unassigned positions', () => {
      let partners = [];
      partners[8 - 1] = 2;
      partners[2 - 1] = 8;
      partners[7 - 1] = 3;
      partners[3 - 1] = 7;
      expect(hasKnots(partners)).toBeFalsy();
    });
  });

  describe('has knots', () => {
    it('knot starts upstream of hairpin', () => {
      let partners = [null, 12, 11, 10, null, 15, 14, 13, null, 4, 3, 2, 8, 7, 6, undefined];
      expect(hasKnots(partners)).toBeTruthy();
    });

    it('knot ends downstream of hairpin', () => {
      let partners = [10, 9, 8, 15, 14, 13, null, 3, 2, 1, undefined, null, 6, 5, 4];
      expect(hasKnots(partners)).toBeTruthy();
    });

    it('kissing loops', () => {
      let partners = [19, 18, 17, null, 13, 12, 11, null, undefined, null, 7, 6, 5, 21, 20, null, 3, 2, 1, 15, 14]
      expect(hasKnots(partners)).toBeTruthy();
    });

    it('has unassigned positions', () => {
      let partners = [];
      partners[2 - 1] = 9;
      partners[9 - 1] = 2;
      partners[5 - 1] = 12;
      partners[12 - 1] = 5;
      expect(hasKnots(partners)).toBeTruthy();
    });
  });
});
