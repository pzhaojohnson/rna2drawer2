import { hasKnots } from './hasKnots';

describe('hasKnots function', () => {
  describe('when the structure has no knots', () => {
    test('empty partners', () => {
      expect(hasKnots([])).toBeFalsy();
    });

    test('unstructured partners', () => {
      let partners = [undefined, null, null, undefined];
      expect(hasKnots(partners)).toBeFalsy();
    });

    test('a stem enclosed by another stem', () => {
      let partners = [15, 14, null, 10, 9, undefined, null, null, 5, 4, undefined, null, null, 2, 1];
      expect(hasKnots(partners)).toBeFalsy();
    });

    test('when there are unassigned positions', () => {
      let partners = [];
      partners[8 - 1] = 2;
      partners[2 - 1] = 8;
      partners[7 - 1] = 3;
      partners[3 - 1] = 7;
      expect(hasKnots(partners)).toBeFalsy();
    });
  });

  describe('when the structure has knots', () => {
    test('a pseudoknot involving a hairpin loop', () => {
      let partners = [null, 12, 11, 10, null, 15, 14, 13, null, 4, 3, 2, 8, 7, 6, undefined];
      expect(hasKnots(partners)).toBeTruthy();
    });

    test('a pseudoknot involving an internal loop', () => {
      let partners = [19, 18, 17, null, 13, 12, 11, null, undefined, null, 7, 6, 5, 21, 20, null, 3, 2, 1, 15, 14]
      expect(hasKnots(partners)).toBeTruthy();
    });

    test('when there are unassigned positions', () => {
      let partners = [];
      partners[2 - 1] = 9;
      partners[9 - 1] = 2;
      partners[5 - 1] = 12;
      partners[12 - 1] = 5;
      expect(hasKnots(partners)).toBeTruthy();
    });
  });
});
