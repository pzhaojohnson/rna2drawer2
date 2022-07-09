import {
  size,
} from './UnpairedRegion';

it('size function', () => {
  // size greater than zero
  let ur = { boundingPosition5: 101, boundingPosition3: 112 };
  expect(size(ur)).toBe(10);
  // size of zero
  ur = { boundingPosition5: 66, boundingPosition3: 67 };
  expect(size(ur)).toBe(0);
});
