import unpairedRegion5 from './unpairedRegion5';

it('returns null on missing arguments', () => {
  let st = { position5: 1, position3: 9 };
  let partners = [9, 8, 7, null, null, null, 3, 2, 1];
  expect(unpairedRegion5(undefined, partners)).toBe(null);
  expect(unpairedRegion5(null, partners)).toBe(null);
  expect(unpairedRegion5(st, undefined)).toBe(null);
  expect(unpairedRegion5(st, null)).toBe(null);
});

it('position5 of stem is 1', () => {
  let st = { position5: 1, position3: 9 };
  let partners = [9, 8, 7, null, null, null, 3, 2, 1];
  let ur = unpairedRegion5(st, partners);
  expect(ur.boundingPosition5).toBe(0);
  expect(ur.boundingPosition3).toBe(1);
});

it('position5 of stem is 2', () => {
  let st = { position5: 2, position3: 10 };
  let partners = [null, 10, 9, 8, null, null, null, 4, 3, 2];
  let ur = unpairedRegion5(st, partners);
  expect(ur.boundingPosition5).toBe(0);
  expect(ur.boundingPosition3).toBe(2);
});

describe('position5 of stem is greater than 2', () => {
  it('unpaired region of size zero', () => {
    let st = { position5: 7, position3: 12 };
    let partners = [6, 5, null, null, 2, 1, 12, 11, null, null, 8, 7];
    let ur = unpairedRegion5(st, partners);
    expect(ur.boundingPosition5).toBe(6);
    expect(ur.boundingPosition3).toBe(7);
  });

  it('unpaired region of size greater than zero', () => {
    let st = { position5: 9, position3: 14 };
    let partners = [6, 5, null, null, 2, 1, null, null, 14, 13, null, null, 10, 9];
    let ur = unpairedRegion5(st, partners);
    expect(ur.boundingPosition5).toBe(6);
    expect(ur.boundingPosition3).toBe(9);
  });
});
