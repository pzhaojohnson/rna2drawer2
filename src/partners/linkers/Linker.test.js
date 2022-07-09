import { createLinker } from './Linker';
import { upstreamBoundingPosition } from './Linker';
import { downstreamBoundingPosition } from './Linker';

test('createLinker function', () => {
  expect(createLinker(
    { upstreamBoundingPosition: 61, downstreamBoundingPosition: 88 }
  )).toStrictEqual(
    { boundingPosition5: 61, boundingPosition3: 88 }
  );
});

test('upstreamBoundingPosition and downstreamBoundingPosition functions', () => {
  let linker = { boundingPosition5: 20, boundingPosition3: 74 };
  expect(upstreamBoundingPosition(linker)).toBe(20);
  expect(downstreamBoundingPosition(linker)).toBe(74);
});
