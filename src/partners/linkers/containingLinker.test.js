import { createLinker } from 'Partners/linkers/Linker';

import { containingLinker } from './containingLinker';

describe('containingLinker function', () => {
  describe('position is in an unpaired region', () => {
    it('a hairpin loop', () => {
      let partners = [9, 8, null, undefined, null, undefined, undefined, 2, 1];
      expect(containingLinker(partners, { position: 6 })).toStrictEqual(
        createLinker({ upstreamBoundingPosition: 2, downstreamBoundingPosition: 8 })
      );
    });

    it('between two stems', () => {
      let partners = [6, 5, null, null, 2, 1, undefined, null, null, 15, 14, null, null, 11, 10];
      expect(containingLinker(partners, { position: 8 })).toStrictEqual(
        createLinker({ upstreamBoundingPosition: 6, downstreamBoundingPosition: 10 })
      );
    });

    it('position is immediately downstream of a stem', () => {
      let partners = [6, 5, null, null, 2, 1, undefined, null, null, 15, 14, null, null, 11, 10];
      expect(containingLinker(partners, { position: 7 })).toStrictEqual(
        createLinker({ upstreamBoundingPosition: 6, downstreamBoundingPosition: 10 })
      );
    });

    it('position is immediately upstream of a stem', () => {
      let partners = [6, 5, null, null, 2, 1, undefined, null, null, 15, 14, null, null, 11, 10];
      expect(containingLinker(partners, { position: 9 })).toStrictEqual(
        createLinker({ upstreamBoundingPosition: 6, downstreamBoundingPosition: 10 })
      );
    });

    it("unpaired region is at 5' end", () => {
      let partners = [undefined, null, null, undefined, 11, 10, undefined, null, null, 6, 5];
      expect(containingLinker(partners, { position: 3 })).toStrictEqual(
        createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 5 })
      );
    });

    it("unpaired region is at 3' end", () => {
      let partners = [6, 5, null, null, 2, 1, undefined, undefined, null];
      expect(containingLinker(partners, { position: 8 })).toStrictEqual(
        createLinker({ upstreamBoundingPosition: 6, downstreamBoundingPosition: 10 })
      );
    });

    it('position is the first position', () => {
      let partners = [undefined, null, null, undefined, 11, 10, undefined, null, null, 6, 5];
      expect(containingLinker(partners, { position: 1 })).toStrictEqual(
        createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 5 })
      );
    });

    it('position is the last position', () => {
      let partners = [6, 5, null, null, 2, 1, undefined, undefined, null];
      expect(containingLinker(partners, { position: partners.length })).toStrictEqual(
        createLinker({ upstreamBoundingPosition: 6, downstreamBoundingPosition: 10 })
      );
    });

    it('unstructured partners', () => {
      let partners = [null, undefined, null, undefined, undefined];
      expect(containingLinker(partners, { position: 2 })).toStrictEqual(
        createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 6 })
      );
    });
  });

  it("position isn't in an unpaired region", () => {
    let partners = [null, 10, 9, 8, null, null, null, 4, 3, 2, null, undefined];
    expect(containingLinker(partners, { position: 2 })).toBeFalsy();
    expect(containingLinker(partners, { position: 4 })).toBeFalsy();
    expect(containingLinker(partners, { position: 9 })).toBeFalsy();
    expect(containingLinker(partners, { position: 10 })).toBeFalsy();
  });

  describe('invalid position', () => {
    let partners = [6, 5, null, null, 2, 1, undefined, undefined];

    it('position is out of bounds', () => {
      expect(containingLinker(partners, { position: 0 })).toBeFalsy();
      expect(containingLinker(partners, { position: -1 })).toBeFalsy();
      expect(containingLinker(partners, { position: -6 })).toBeFalsy();
      expect(containingLinker(partners, { position: partners.length + 1 })).toBeFalsy();
      expect(containingLinker(partners, { position: partners.length + 6 })).toBeFalsy();
    });

    it('nonfinite position', () => {
      expect(containingLinker(partners, { position: NaN })).toBeFalsy();
      expect(containingLinker(partners, { position: Infinity })).toBeFalsy();
      expect(containingLinker(partners, { position: -Infinity })).toBeFalsy();
    });
  });
});
