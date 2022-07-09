import { createLinker } from './Linker';
import { deepCopyLinker } from './Linker';
import { upstreamBoundingPosition } from './Linker';
import { downstreamBoundingPosition } from './Linker';
import { positionsInLinker } from './Linker';
import { numPositionsInLinker } from './Linker';

test('createLinker function', () => {
  expect(createLinker(
    { upstreamBoundingPosition: 61, downstreamBoundingPosition: 88 }
  )).toStrictEqual(
    { boundingPosition5: 61, boundingPosition3: 88 }
  );
});

test('deepCopyLinker function', () => {
  let linker = createLinker({ upstreamBoundingPosition: 58, downstreamBoundingPosition: 112 });
  let deepCopy = deepCopyLinker(linker);
  expect(deepCopy).not.toBe(linker); // is a new object
  expect(deepCopy).toStrictEqual(linker);
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

test('numPositionsInLinker function', () => {
  // multiple positions in linker
  let linker = createLinker({ upstreamBoundingPosition: 101, downstreamBoundingPosition: 112 });
  expect(numPositionsInLinker(linker)).toBe(10);

  // zero positions in linker
  linker = createLinker({ upstreamBoundingPosition: 66, downstreamBoundingPosition: 67 });
  expect(numPositionsInLinker(linker)).toBe(0);
});
