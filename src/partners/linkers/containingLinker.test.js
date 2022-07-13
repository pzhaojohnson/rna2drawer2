import { createLinker } from 'Partners/linkers/Linker';

import { containingLinker } from './containingLinker';

test('containingLinker function', () => {
  let partners = [null, null, 11, 10, 9, null, null, null, 5, 4, 3];

  // position is in a linker
  expect(
    containingLinker(partners, { position: 7 })
  ).toStrictEqual(
    createLinker({ upstreamBoundingPosition: 5, downstreamBoundingPosition: 9 })
  );

  // position is not in a linker
  expect(containingLinker(partners, { position: 3 })).toBeUndefined();
});
