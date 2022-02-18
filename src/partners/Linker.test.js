import { upstreamBoundingPosition } from './Linker';
import { downstreamBoundingPosition } from './Linker';

test('upstreamBoundingPosition and downstreamBoundingPosition functions', () => {
  let linker = { boundingPosition5: 20, boundingPosition3: 74 };
  expect(upstreamBoundingPosition(linker)).toBe(20);
  expect(downstreamBoundingPosition(linker)).toBe(74);
});
