import {
  size,
  positions,
} from './UnpairedRegion';

it('size function', () => {
  // size greater than zero
  let ur = { boundingPosition5: 101, boundingPosition3: 112 };
  expect(size(ur)).toBe(10);
  // size of zero
  ur = { boundingPosition5: 66, boundingPosition3: 67 };
  expect(size(ur)).toBe(0);
});

describe('positions function', () => {
  it('unpaired region containing multiple positions', () => {
    let ur = { boundingPosition5: 22, boundingPosition3: 27 };
    expect(positions(ur)).toStrictEqual([23, 24, 25, 26]);
  });

  it('unpaired region containing zero positions', () => {
    let ur = { boundingPosition5: 8, boundingPosition3: 9 };
    expect(positions(ur)).toStrictEqual([]);
  });
});
