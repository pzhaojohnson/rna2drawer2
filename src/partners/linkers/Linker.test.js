import { createLinker } from './Linker';
import { upstreamBoundingPosition } from './Linker';
import { downstreamBoundingPosition } from './Linker';
import { positionsInLinker } from './Linker';

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

describe('positionsInLinker function', () => {
  test('a linker containing multiple positions', () => {
    let linker = createLinker({ upstreamBoundingPosition: 22, downstreamBoundingPosition: 27 });
    expect(positionsInLinker(linker)).toStrictEqual([23, 24, 25, 26]);
  });

  test('a linker containing zero positions', () => {
    let linker = createLinker({ upstreamBoundingPosition: 8, downstreamBoundingPosition: 9 });
    expect(positionsInLinker(linker)).toStrictEqual([]);
  });
});
