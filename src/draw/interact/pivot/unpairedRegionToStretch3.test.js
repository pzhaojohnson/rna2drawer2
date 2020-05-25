import unpairedRegionToStretch3 from './unpairedRegionToStretch3';

it('returns null on missing arguments', () => {
  let partners = [9, 8, 7, null, null, null, 3, 2, 1];
  expect(unpairedRegionToStretch3(undefined, partners)).toBe(null);
  expect(unpairedRegionToStretch3(null, partners)).toBe(null);
  expect(unpairedRegionToStretch3(2, undefined)).toBe(null);
  expect(unpairedRegionToStretch3(2, null)).toBe(null);
});

it('returns null if position is not in stem', () => {
  let partners = [null, null, 11, 10, 9, null, null, null, 5, 4, 3];
  expect(unpairedRegionToStretch3(2, partners)).toBe(null);
});

it("3' bounding position less than partners length", () => {
  let partners = [6, 5, null, null, 2, 1, null, null, 14, 13, null, null, 10, 9];
  let ur = unpairedRegionToStretch3(5, partners);
  expect(ur.boundingPosition5).toBe(6);
  expect(ur.boundingPosition3).toBe(9);
});

it("3' bounding position greater than partners length", () => {
  let partners = [null, 10, 9, 8, null, null, null, 4, 3, 2, null, null];
  let ur = unpairedRegionToStretch3(3, partners);
  expect(ur.boundingPosition5).toBe(10);
  expect(ur.boundingPosition3).toBe(13);
});

it('unpaired region of size zero', () => {
  let partners = [6, 5, null, null, 2, 1, 12, 11, null, null, 8, 7];
  let ur = unpairedRegionToStretch3(6, partners);
  expect(ur.boundingPosition5).toBe(6);
  expect(ur.boundingPosition3).toBe(7);
});
