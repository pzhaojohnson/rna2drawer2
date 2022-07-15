import { createStem } from 'Partners/stems/Stem';
import { createLinker } from 'Partners/linkers/Linker';

import { upstreamNeighboringLinker } from './neighboringLinkers';
import { downstreamNeighboringLinker } from './neighboringLinkers';

describe('upstreamNeighboringLinker and downstreamNeighboringLinker functions', () => {
  test('when there are no positions upstream or downstream', () => {
    let partners = [9, 8, 7, null, null, null, 3, 2, 1];
    let stem = createStem({ bottomPair: [1, 9], numPairs: 3 });
    expect(upstreamNeighboringLinker(partners, { stem })).toStrictEqual(
      createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 1 })
    );
    expect(downstreamNeighboringLinker(partners, { stem })).toStrictEqual(
      createLinker({ upstreamBoundingPosition: 9, downstreamBoundingPosition: 10 })
    );
  });

  test('when all positions upstream and downstream are unpaired', () => {
    let partners = [undefined, null, 10, 9, null, null, null, null, 4, 3, undefined, null, undefined];
    let stem = createStem({ bottomPair: [3, 10], numPairs: 2 });
    expect(upstreamNeighboringLinker(partners, { stem })).toStrictEqual(
      createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 3 })
    );
    expect(downstreamNeighboringLinker(partners, { stem })).toStrictEqual(
      createLinker({ upstreamBoundingPosition: 10, downstreamBoundingPosition: 14 })
    );
  });

  test('when there are stems immediately upstream and downstream', () => {
    let partners = [3, null, 1, 6, null, 4, 9, null, 7];
    let stem = createStem({ bottomPair: [4, 6], numPairs: 1 });
    expect(upstreamNeighboringLinker(partners, { stem })).toStrictEqual(
      createLinker({ upstreamBoundingPosition: 3, downstreamBoundingPosition: 4 })
    );
    expect(downstreamNeighboringLinker(partners, { stem })).toStrictEqual(
      createLinker({ upstreamBoundingPosition: 6, downstreamBoundingPosition: 7 })
    );
  })

  test('when there are stems not immediately upstream or downstream', () => {
    let partners = [3, null, 1, undefined, null, 8, null, 6, undefined, 12, null, 10];
    let stem = createStem({ bottomPair: [6, 8], numPairs: 1 });
    expect(upstreamNeighboringLinker(partners, { stem })).toStrictEqual(
      createLinker({ upstreamBoundingPosition: 3, downstreamBoundingPosition: 6 })
    );
    expect(downstreamNeighboringLinker(partners, { stem })).toStrictEqual(
      createLinker({ upstreamBoundingPosition: 8, downstreamBoundingPosition: 10 })
    );
  });

  test('when the stem is enclosed by another stem', () => {
    let partners = [14, 13, null, 10, 9, undefined, null, null, 5, 4, undefined, null, 2, 1];
    let stem = createStem({ bottomPair: [4, 10], numPairs: 2 });
    expect(upstreamNeighboringLinker(partners, { stem })).toStrictEqual(
      createLinker({ upstreamBoundingPosition: 2, downstreamBoundingPosition: 4 })
    );
    expect(downstreamNeighboringLinker(partners, { stem })).toStrictEqual(
      createLinker({ upstreamBoundingPosition: 10, downstreamBoundingPosition: 13 })
    );
  });
});
