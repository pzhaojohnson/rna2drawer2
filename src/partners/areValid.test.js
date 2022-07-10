import { areValid } from './areValid';
import { assertAreValid } from './areValid';

describe('areValid function', () => {
  describe('valid partners', () => {
    it('empty', () => {
      expect(areValid([])).toBeTruthy();
    });

    it('entirely unpaired', () => {
      let partners = [null, undefined, undefined, null, null];
      expect(areValid(partners)).toBeTruthy();
    });

    it('with pairs', () => {
      let partners = [6, 5, null, undefined, 2, 1, null, undefined];
      expect(areValid(partners)).toBeTruthy();
    });

    it('with knots', () => {
      let partners = [null, 9, 8, undefined, 12, 11, null, 3, 2, null, 6, 5];
      expect(areValid(partners)).toBeTruthy();
    });

    it('entirely paired', () => {
      let partners = [6, 5, 4, 3, 2, 1];
      expect(areValid(partners)).toBeTruthy();
    });

    it('has unassigned positions', () => {
      let partners = [null, 6, null, null, undefined, 2];
      partners.length = 50;
      partners[21 - 1] = 32;
      partners[32 - 1] = 21;
      expect(areValid(partners)).toBeTruthy();
    });
  });

  describe('invalid partners', () => {
    it("partner isn't an integer", () => {
      let partners = [null, 4.5, null, null, null, null];
      expect(areValid(partners)).toBeFalsy();
    });

    it('partner is unpaired', () => {
      let partners = [null, undefined, null, 2, null];
      expect(areValid(partners)).toBeFalsy();
      partners = [null, 4, null, null, null, null];
      expect(areValid(partners)).toBeFalsy();
    });

    it('partner is in another pair', () => {
      let partners = [5, null, null, null, 9, undefined, null, undefined, 5];
      expect(areValid(partners)).toBeFalsy();
    });

    it('partner is out of bounds', () => {
      let partners = [null, 12, undefined, undefined]; // above bounds
      expect(areValid(partners)).toBeFalsy();
      partners = [undefined, undefined, undefined, -2, null]; // below bounds
      expect(areValid(partners)).toBeFalsy();
    });

    it('position is paired with itself', () => {
      let partners = [null, null, 3, undefined, undefined];
      expect(areValid(partners)).toBeFalsy();
    });

    it('iterates over unassigned positions', () => {
      let partners = [5, null, undefined, undefined, 1];
      // must iterate over unassigned positions
      // to find invalid partner
      partners[24] = 3;
      expect(areValid(partners)).toBeFalsy();
    });

    it('partner is an unassigned position', () => {
      let partners = [null, 25, undefined, undefined];
      partners.length = 40;
      expect(areValid(partners)).toBeFalsy();
    });
  });
});

describe('assertAreValid function', () => {
  it('are valid', () => {
    let partners = [null, 6, null, undefined, undefined, 2];
    expect(
      () => assertAreValid(partners)
    ).not.toThrow()
  });

  it('are invalid', () => {
    // downstream partner is out of bounds
    let partner = [undefined, 60, null, null];
    expect(
      () => assertAreValid(partners)
    ).toThrow();
  });
});
