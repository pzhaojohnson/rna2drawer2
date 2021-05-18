import {
  containingUnpairedRegion,
} from './containing';

describe('containingUnpairedRegion function', () => {
  describe('position is in an unpaired region', () => {
    it('a hairpin loop', () => {
      let partners = [9, 8, null, undefined, null, undefined, undefined, 2, 1];
      expect(containingUnpairedRegion(partners, 6)).toStrictEqual(
        { boundingPosition5: 2, boundingPosition3: 8 }
      );
    });

    it('between two stems', () => {
      let partners = [6, 5, null, null, 2, 1, undefined, null, null, 15, 14, null, null, 11, 10];
      expect(containingUnpairedRegion(partners, 8)).toStrictEqual(
        { boundingPosition5: 6, boundingPosition3: 10 }
      );
    });

    it('position is immediately downstream of a stem', () => {
      let partners = [6, 5, null, null, 2, 1, undefined, null, null, 15, 14, null, null, 11, 10];
      expect(containingUnpairedRegion(partners, 7)).toStrictEqual(
        { boundingPosition5: 6, boundingPosition3: 10 }
      );
    });

    it('position is immediately upstream of a stem', () => {
      let partners = [6, 5, null, null, 2, 1, undefined, null, null, 15, 14, null, null, 11, 10];
      expect(containingUnpairedRegion(partners, 9)).toStrictEqual(
        { boundingPosition5: 6, boundingPosition3: 10 }
      );
    });

    it("unpaired region is at 5' end", () => {
      let partners = [undefined, null, null, undefined, 11, 10, undefined, null, null, 6, 5];
      expect(containingUnpairedRegion(partners, 3)).toStrictEqual(
        { boundingPosition5: 0, boundingPosition3: 5 }
      );
    });

    it("unpaired region is at 3' end", () => {
      let partners = [6, 5, null, null, 2, 1, undefined, undefined, null];
      expect(containingUnpairedRegion(partners, 8)).toStrictEqual(
        { boundingPosition5: 6, boundingPosition3: 10 }
      );
    });

    it('position is the first position', () => {
      let partners = [undefined, null, null, undefined, 11, 10, undefined, null, null, 6, 5];
      expect(containingUnpairedRegion(partners, 1)).toStrictEqual(
        { boundingPosition5: 0, boundingPosition3: 5 }
      );
    });

    it('position is the last position', () => {
      let partners = [6, 5, null, null, 2, 1, undefined, undefined, null];
      expect(containingUnpairedRegion(partners, partners.length)).toStrictEqual(
        { boundingPosition5: 6, boundingPosition3: 10 }
      );
    });

    it('unstructured partners', () => {
      let partners = [null, undefined, null, undefined, undefined];
      expect(containingUnpairedRegion(partners, 2)).toStrictEqual(
        { boundingPosition5: 0, boundingPosition3: 6 }
      );
    });
  });

  it("position isn't in an unpaired region", () => {
    let partners = [null, 10, 9, 8, null, null, null, 4, 3, 2, null, undefined];
    expect(containingUnpairedRegion(partners, 2)).toBeFalsy();
    expect(containingUnpairedRegion(partners, 4)).toBeFalsy();
    expect(containingUnpairedRegion(partners, 9)).toBeFalsy();
    expect(containingUnpairedRegion(partners, 10)).toBeFalsy();
  });

  describe('invalid position', () => {
    let partners = [6, 5, null, null, 2, 1, undefined, undefined];

    it('position is out of bounds', () => {
      expect(containingUnpairedRegion(partners, 0)).toBeFalsy();
      expect(containingUnpairedRegion(partners, -1)).toBeFalsy();
      expect(containingUnpairedRegion(partners, -6)).toBeFalsy();
      expect(containingUnpairedRegion(partners, partners.length + 1)).toBeFalsy();
      expect(containingUnpairedRegion(partners, partners.length + 6)).toBeFalsy();
    });

    it('nonfinite position', () => {
      expect(containingUnpairedRegion(partners, NaN)).toBeFalsy();
      expect(containingUnpairedRegion(partners, Infinity)).toBeFalsy();
      expect(containingUnpairedRegion(partners, -Infinity)).toBeFalsy();
    });
  });
});
