import unpairedRegionOfPosition from './unpairedRegionOfPosition';

let partners = [null, null, 11, 10, 9, null, null, null, 5, 4, 3, null];

it('out of range', () => {
  expect(unpairedRegionOfPosition(0, partners)).toBe(null); // just below range
  expect(unpairedRegionOfPosition(1, partners)).toBeTruthy(); // start of range
  expect(unpairedRegionOfPosition(partners.length, partners)).toBeTruthy(); // end of range
  expect(unpairedRegionOfPosition(partners.length + 1, partners)).toBe(null); // just above range
});

it('not in an unpaired region', () => {
  expect(unpairedRegionOfPosition(4, partners)).toBe(null);
});

it('both bounding positions are in bounds', () => {
  let ur = unpairedRegionOfPosition(6, partners);
  expect(ur.boundingPosition5).toBe(5);
  expect(ur.boundingPosition3).toBe(9);
});

it("5' bounding position is out of bounds", () => {
  let ur = unpairedRegionOfPosition(2, partners);
  expect(ur.boundingPosition5).toBe(0);
  expect(ur.boundingPosition3).toBe(3);
});

it("3' bounding position is out of bounds and size of one", () => {
  let ur = unpairedRegionOfPosition(12, partners);
  expect(ur.boundingPosition5).toBe(11);
  expect(ur.boundingPosition3).toBe(13);
});
