import unpairedRegionToStretch5 from './unpairedRegionToStretch5';

it('returns null on missing arguments', () => {
  let partners = [9, 8, 7, null, null, null, 3, 2, 1];
  expect(unpairedRegionToStretch5(undefined, partners)).toBe(null);
  expect(unpairedRegionToStretch5(null, partners)).toBe(null);
  expect(unpairedRegionToStretch5(2, undefined)).toBe(null);
  expect(unpairedRegionToStretch5(2, null)).toBe(null);
});

it('returns null if position is not in stem', () => {
  let partners = [null, null, 11, 10, 9, null, null, null, 5, 4, 3];
  expect(unpairedRegionToStretch5(2, partners)).toBe(null);
});

it("5' bounding position greater than zero", () => {
  let partners = [6, 5, null, null, 2, 1, null, null, 14, 13, null, null, 10, 9];
  let ur = unpairedRegionToStretch5(10, partners);
  expect(ur.boundingPosition5).toBe(6);
  expect(ur.boundingPosition3).toBe(9);
});

it("5' bounding position of zero", () => {
  let partners = [null, 10, 9, 8, null, null, null, 4, 3, 2];
  let ur = unpairedRegionToStretch5(3, partners);
  expect(ur.boundingPosition5).toBe(0);
  expect(ur.boundingPosition3).toBe(2);
});

it('unpaired region of size zero', () => {
  let partners = [6, 5, null, null, 2, 1, 12, 11, null, null, 8, 7];
  let ur = unpairedRegionToStretch5(8, partners);
  expect(ur.boundingPosition5).toBe(6);
  expect(ur.boundingPosition3).toBe(7);
});
