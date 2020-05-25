import stretchOfUnpairedRegion from './stretchOfUnpairedRegion';

it("handles 5' bounding position of zero", () => {
  let ur = { boundingPosition5: 0, boundingPosition3: 2 };
  expect(stretchOfUnpairedRegion(ur, [
    { stretch3: 1.5 },
    { stretch3: 5 },
  ])).toBeCloseTo(1.5);
});

it('handles undefined per base props in array', () => {
  let ur = { boundingPosition5: 2, boundingPosition3: 5 };
  expect(stretchOfUnpairedRegion(ur, [
    { stretch3: 3 },
    undefined,
    { stretch3: 8 },
    undefined,
    { stretch3: 10 },
    undefined,
  ])).toBeCloseTo(8);
});

it('bounds of for loop are correct', () => {
  let ur = { boundingPosition5: 2, boundingPosition3: 6 };
  expect(stretchOfUnpairedRegion(ur, [
    { stretch3: 1 },
    { stretch3: 10 },
    { stretch3: 100 },
    { stretch3: 1000 },
    { stretch3: 10000 },
    { stretch3: 100000 },
  ])).toBeCloseTo(11110);
});
