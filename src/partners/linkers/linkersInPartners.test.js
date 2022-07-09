import { createLinker } from 'Partners/linkers/Linker';

import { linkersInPartners } from './linkersInPartners';

describe('linkersInPartners function', () => {
  test('empty partners', () => {
    let partners = [];
    expect(linkersInPartners(partners)).toStrictEqual([]);
  });

  test('unstructured partners of length greater than zero', () => {
    let partners = [undefined, null, undefined, null, undefined];
    expect(linkersInPartners(partners)).toStrictEqual([
      createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 6 }),
    ]);
  });

  test('when first and last positions are in stems', () => {
    let partners = [6, 5, null, null, 2, 1];
    // omits leading and trailing linkers containing zero positions
    expect(linkersInPartners(partners)).toStrictEqual([
      createLinker({ upstreamBoundingPosition: 2, downstreamBoundingPosition: 5 }),
    ]);
  });

  test('when first and last positions are unpaired', () => {
    let partners = [
      null, null,
      8, 7, undefined, undefined, 4, 3,
      undefined, undefined,
    ];
    // includes leading and trailing linkers
    expect(linkersInPartners(partners)).toStrictEqual([
      createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 3 }),
      createLinker({ upstreamBoundingPosition: 4, downstreamBoundingPosition: 7 }),
      createLinker({ upstreamBoundingPosition: 8, downstreamBoundingPosition: 11 }),
    ]);
  });

  test('internal linkers with varying numbers of positions', () => {
    let partners = [
      6, 5, null, undefined, 2, 1,
      9, null, 7,
      null,
      18, 17, 16, undefined, null, 13, 12, 11,
      undefined, undefined, null, undefined,
      30, 29, null, null, null, undefined, 24, 23,
    ];
    expect(linkersInPartners(partners)).toStrictEqual([
      createLinker({ upstreamBoundingPosition: 2, downstreamBoundingPosition: 5 }),
      createLinker({ upstreamBoundingPosition: 6, downstreamBoundingPosition: 7 }),
      createLinker({ upstreamBoundingPosition: 7, downstreamBoundingPosition: 9 }),
      createLinker({ upstreamBoundingPosition: 9, downstreamBoundingPosition: 11 }),
      createLinker({ upstreamBoundingPosition: 13, downstreamBoundingPosition: 16 }),
      createLinker({ upstreamBoundingPosition: 18, downstreamBoundingPosition: 23 }),
      createLinker({ upstreamBoundingPosition: 24, downstreamBoundingPosition: 29 }),
    ]);
  });

  test('a leading pseudoknot', () => {
    let partners = [
      8, 7,
      null,
      12, 11, 10,
      2, 1,
      undefined,
      6, 5, 4,
    ];
    expect(linkersInPartners(partners)).toStrictEqual([
      createLinker({ upstreamBoundingPosition: 2, downstreamBoundingPosition: 4 }),
      createLinker({ upstreamBoundingPosition: 6, downstreamBoundingPosition: 7 }),
      createLinker({ upstreamBoundingPosition: 8, downstreamBoundingPosition: 10 }),
    ]);
  });

  test('a trailing pseudoknot', () => {
    let partners = [
      11, 10,
      undefined, undefined,
      14, 13, 12,
      null, null,
      2, 1,
      7, 6, 5,
    ];
    expect(linkersInPartners(partners)).toStrictEqual([
      createLinker({ upstreamBoundingPosition: 2, downstreamBoundingPosition: 5 }),
      createLinker({ upstreamBoundingPosition: 7, downstreamBoundingPosition: 10 }),
      createLinker({ upstreamBoundingPosition: 11, downstreamBoundingPosition: 12 }),
    ]);
  });
});
