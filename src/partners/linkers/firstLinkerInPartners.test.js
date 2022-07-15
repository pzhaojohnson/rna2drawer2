import { createLinker } from 'Partners/linkers/Linker';

import { firstLinkerInPartners } from './firstLinkerInPartners';

describe('firstLinkerInPartners function', () => {
  test('empty partners', () => {
    let partners = [];
    expect(firstLinkerInPartners(partners)).toStrictEqual(
      createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 1 })
    );
  });

  test('unstructured partners', () => {
    let partners = [null, null, undefined, null, undefined, undefined];
    expect(firstLinkerInPartners(partners)).toStrictEqual(
      createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 7 })
    );
  });

  test('when the first position is upstream of a stem', () => {
    let partners = [undefined, undefined, 9, 8, null, null, null, 4, 3];
    expect(firstLinkerInPartners(partners)).toStrictEqual(
      createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 3 })
    );
  });

  test('when the first position is in a stem', () => {
    let partners = [9, 8, 7, undefined, undefined, undefined, 3, 2, 1];
    expect(firstLinkerInPartners(partners)).toStrictEqual(
      createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 1 })
    );
  });
});
