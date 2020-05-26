import addStretchToUnpairedRegion from './addStretchToUnpairedRegion';

it('returns early for missing arguments', () => {
  let ur = { boundingPosition5: 0, boundingPosition3: 2 };
  let perBaseProps = [{ stretch3: 0 }];
  expect(
    () => addStretchToUnpairedRegion(undefined, ur, perBaseProps)
  ).not.toThrow();
  expect(
    () => addStretchToUnpairedRegion(null, ur, perBaseProps)
  ).not.toThrow();
  expect(
    () => addStretchToUnpairedRegion(2, undefined, perBaseProps)
  ).not.toThrow();
  expect(
    () => addStretchToUnpairedRegion(2, null, perBaseProps)
  ).not.toThrow();
  expect(
    () => addStretchToUnpairedRegion(2, ur, undefined)
  ).not.toThrow();
  expect(
    () => addStretchToUnpairedRegion(2, ur, null)
  ).not.toThrow();
});

it("5' bounding position of zero", () => {
  let ur = { boundingPosition5: 0, boundingPosition3: 3 };
  let perBaseProps = [
    { stretch3: 0 },
    { stretch3: 0 },
    { stretch3: 0 },
  ];
  addStretchToUnpairedRegion(3, ur, perBaseProps);
  expect(perBaseProps[0].stretch3).toBeCloseTo(1.5);
  expect(perBaseProps[1].stretch3).toBeCloseTo(1.5);
  expect(perBaseProps[2].stretch3).toBe(0);
});

it("5' bounding position greater than zero", () => {
  let ur = { boundingPosition5: 2, boundingPosition3: 5 };
  let perBaseProps = [
    { stretch3: 0 },
    { stretch3: 0 },
    { stretch3: 0 },
    { stretch3: 0 },
    { stretch3: 0 },
    { stretch3: 0 },
  ];
  addStretchToUnpairedRegion(6, ur, perBaseProps);
  expect(perBaseProps[0].stretch3).toBe(0);
  expect(perBaseProps[1].stretch3).toBeCloseTo(2);
  expect(perBaseProps[2].stretch3).toBeCloseTo(2);
  expect(perBaseProps[3].stretch3).toBeCloseTo(2);
  expect(perBaseProps[4].stretch3).toBe(0);
  expect(perBaseProps[5].stretch3).toBe(0);
});

it('no positions to add stretch to', () => {
  let ur = { boundingPosition5: 0, boundingPosition3: 1 };
  let perBaseProps = [
    { stretch3: 0 },
    { stretch3: 0 },
  ];
  addStretchToUnpairedRegion(5, ur, perBaseProps);
  perBaseProps.forEach(props => {
    expect(props.stretch3).toBe(0);
  });
});

it('handles undefined props', () => {
  let ur = { boundingPosition5: 2, boundingPosition3: 5 };
  let perBaseProps = [
    { stretch3: 0 },
    { stretch3: 0 },
    undefined,
    { stretch3: 0 },
    { stretch3: 0 },
    { stretch3: 0 },
  ];
  addStretchToUnpairedRegion(6, ur, perBaseProps);
  expect(perBaseProps[0].stretch3).toBe(0);
  expect(perBaseProps[1].stretch3).toBeCloseTo(2);
  expect(perBaseProps[2]).toBe(undefined);
  expect(perBaseProps[3].stretch3).toBeCloseTo(2);
  expect(perBaseProps[4].stretch3).toBe(0);
  expect(perBaseProps[5].stretch3).toBe(0);
});

it('adds negative stretch', () => {
  let ur = { boundingPosition5: 2, boundingPosition3: 5 };
  let perBaseProps = [
    { stretch3: 0 },
    { stretch3: 0 },
    { stretch3: 0 },
    { stretch3: 0 },
    { stretch3: 0 },
    { stretch3: 0 },
  ];
  addStretchToUnpairedRegion(-6, ur, perBaseProps);
  expect(perBaseProps[0].stretch3).toBe(0);
  expect(perBaseProps[1].stretch3).toBeCloseTo(-2);
  expect(perBaseProps[2].stretch3).toBeCloseTo(-2);
  expect(perBaseProps[3].stretch3).toBeCloseTo(-2);
  expect(perBaseProps[4].stretch3).toBe(0);
  expect(perBaseProps[5].stretch3).toBe(0);
});
