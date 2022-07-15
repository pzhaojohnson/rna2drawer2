import { createLinker } from 'Partners/linkers/Linker';

import { lastLinkerInPartners } from './lastLinkerInPartners';

describe('lastLinkerInPartners function', () => {
  test('empty partners', () => {
    let partners = [];
    expect(lastLinkerInPartners(partners)).toStrictEqual(
      createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 1 })
    );
  });

  test('unstructured partners', () => {
    let partners = [undefined, null, null, undefined];
    expect(lastLinkerInPartners(partners)).toStrictEqual(
      createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 5 })
    );
  });

  test('when the last position is downstream of a stem', () => {
    let partners = [null, 10, 9, 8, null, undefined, null, 4, 3, 2, undefined, null, undefined];
    expect(lastLinkerInPartners(partners)).toStrictEqual(
      createLinker({ upstreamBoundingPosition: 10, downstreamBoundingPosition: 14 })
    );
  });

  test('when the last position is in a stem', () => {
    let partners = [6, 5, null, null, 2, 1];
    expect(lastLinkerInPartners(partners)).toStrictEqual(
      createLinker({ upstreamBoundingPosition: 6, downstreamBoundingPosition: 7 })
    );
  });
});
