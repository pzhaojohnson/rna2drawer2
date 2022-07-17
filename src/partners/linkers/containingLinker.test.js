import { createLinker } from 'Partners/linkers/Linker';

import { containingLinker } from './containingLinker';

describe('containingLinker function', () => {
  describe('when the position is in a linker', () => {
    test('when the position is in a hairpin loop', () => {
      let partners = [9, 8, null, undefined, null, undefined, undefined, 2, 1];
      expect(containingLinker(partners, { position: 6 })).toStrictEqual(
        createLinker({ upstreamBoundingPosition: 2, downstreamBoundingPosition: 8 })
      );
    });

    test('when the position is between two stems', () => {
      let partners = [6, 5, null, null, 2, 1, undefined, null, null, 15, 14, null, null, 11, 10];
      expect(containingLinker(partners, { position: 8 })).toStrictEqual(
        createLinker({ upstreamBoundingPosition: 6, downstreamBoundingPosition: 10 })
      );
    });

    test('when the position is immediately downstream of a stem', () => {
      let partners = [6, 5, null, null, 2, 1, undefined, null, null, 15, 14, null, null, 11, 10];
      expect(containingLinker(partners, { position: 7 })).toStrictEqual(
        createLinker({ upstreamBoundingPosition: 6, downstreamBoundingPosition: 10 })
      );
    });

    test('when the position is immediately upstream of a stem', () => {
      let partners = [6, 5, null, null, 2, 1, undefined, null, null, 15, 14, null, null, 11, 10];
      expect(containingLinker(partners, { position: 9 })).toStrictEqual(
        createLinker({ upstreamBoundingPosition: 6, downstreamBoundingPosition: 10 })
      );
    });

    test('when the position is in the upstreammost linker', () => {
      let partners = [undefined, null, null, undefined, 11, 10, undefined, null, null, 6, 5];
      expect(containingLinker(partners, { position: 3 })).toStrictEqual(
        createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 5 })
      );
    });

    test('when the position is in the downstreammost linker', () => {
      let partners = [6, 5, null, null, 2, 1, undefined, undefined, null];
      expect(containingLinker(partners, { position: 8 })).toStrictEqual(
        createLinker({ upstreamBoundingPosition: 6, downstreamBoundingPosition: 10 })
      );
    });

    test('when position is the first position', () => {
      let partners = [undefined, null, null, undefined, 11, 10, undefined, null, null, 6, 5];
      expect(containingLinker(partners, { position: 1 })).toStrictEqual(
        createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 5 })
      );
    });

    test('when the position is the last position', () => {
      let partners = [6, 5, null, null, 2, 1, undefined, undefined, null];
      expect(containingLinker(partners, { position: partners.length })).toStrictEqual(
        createLinker({ upstreamBoundingPosition: 6, downstreamBoundingPosition: 10 })
      );
    });

    test('unstructured partners', () => {
      let partners = [null, undefined, null, undefined, undefined];
      expect(containingLinker(partners, { position: 2 })).toStrictEqual(
        createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 6 })
      );
    });
  });

  test('when the position is not in a linker', () => {
    let partners = [null, 10, 9, 8, null, null, null, 4, 3, 2, null, undefined];
    expect(containingLinker(partners, { position: 2 })).toBeUndefined();
    expect(containingLinker(partners, { position: 4 })).toBeUndefined();
    expect(containingLinker(partners, { position: 9 })).toBeUndefined();
    expect(containingLinker(partners, { position: 10 })).toBeUndefined();
  });

  describe('when the position is invalid', () => {
    test('when the position is out of range', () => {
      let partners = [6, 5, null, null, 2, 1, undefined, undefined];
      expect(containingLinker(partners, { position: 0 })).toBeUndefined();
      expect(containingLinker(partners, { position: -1 })).toBeUndefined();
      expect(containingLinker(partners, { position: -6 })).toBeUndefined();
      expect(containingLinker(partners, { position: partners.length + 1 })).toBeUndefined();
      expect(containingLinker(partners, { position: partners.length + 6 })).toBeUndefined();
    });

    test('nonfinite positions', () => {
      let partners = [6, 5, null, null, 2, 1, undefined, undefined];
      expect(containingLinker(partners, { position: NaN })).toBeUndefined();
      expect(containingLinker(partners, { position: Infinity })).toBeUndefined();
      expect(containingLinker(partners, { position: -Infinity })).toBeUndefined();
    });
  });
});
