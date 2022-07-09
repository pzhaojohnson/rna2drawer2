import { createLinker } from 'Partners/linkers/Linker';

import { linkerContainsPosition } from './linkerContainsPosition';

test('linkerContainsPosition function', () => {
  let linker = createLinker({ upstreamBoundingPosition: 5, downstreamBoundingPosition: 9 });

  // positions in the linker
  expect(linkerContainsPosition(linker, 6)).toBeTruthy();
  expect(linkerContainsPosition(linker, 7)).toBeTruthy();
  expect(linkerContainsPosition(linker, 8)).toBeTruthy();

  // the bounding positions
  expect(linkerContainsPosition(linker, 5)).toBeFalsy();
  expect(linkerContainsPosition(linker, 9)).toBeFalsy();

  // positions further outside the linker
  expect(linkerContainsPosition(linker, 2)).toBeFalsy();
  expect(linkerContainsPosition(linker, 50)).toBeFalsy();

  expect(linkerContainsPosition(linker, 0)).toBeFalsy(); // zero
  expect(linkerContainsPosition(linker, -1)).toBeFalsy(); // negative

  // nonfinite positions
  expect(linkerContainsPosition(linker, NaN)).toBeFalsy();
  expect(linkerContainsPosition(linker, Infinity)).toBeFalsy();
  expect(linkerContainsPosition(linker, -Infinity)).toBeFalsy();
});
