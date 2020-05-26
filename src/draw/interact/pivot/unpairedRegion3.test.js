import unpairedRegion3 from './unpairedRegion3';

it('returns null on missing arguments', () => {
  let st = { position5: 1, position3: 9 };
  let partners = [9, 8, 7, null, null, null, 3, 2, 1];
  expect(unpairedRegion3(undefined, partners)).toBe(null);
  expect(unpairedRegion3(null, partners)).toBe(null);
  expect(unpairedRegion3(st, undefined)).toBe(null);
  expect(unpairedRegion3(st, null)).toBe(null);
});

it('position3 of stem equal to partners length', () => {
  let st = { position5: 3, position3: 11 };
  let partners = [null, null, 11, 10, 9, null, null, null, 5, 4, 3];
  let ur = unpairedRegion3(st, partners);
  expect(ur.boundingPosition5).toBe(11);
  expect(ur.boundingPosition3).toBe(12);
});

it('position3 of stem equal to partners length minus one', () => {
  let st = { position5: 3, position3: 11 };
  let partners = [null, null, 11, 10, 9, null, null, null, 5, 4, 3, null];
  let ur = unpairedRegion3(st, partners);
  expect(ur.boundingPosition5).toBe(11);
  expect(ur.boundingPosition3).toBe(13);
});

describe('position3 of stem less than partners length minus one', () => {
  it('unpaired region of size zero', () => {
    let st = { position5: 1, position3: 6 };
    let partners = [6, 5, null, null, 2, 1, 12, 11, null, null, 8, 7];
    let ur = unpairedRegion3(st, partners);
    expect(ur.boundingPosition5).toBe(6);
    expect(ur.boundingPosition3).toBe(7);
  });

  it('unpaired region of size greater than zero', () => {
    let st = { position5: 1, position3: 6 };
    let partners = [6, 5, null, null, 2, 1, null, null, 14, 13, null, null, 10, 9];
    let ur = unpairedRegion3(st, partners);
    expect(ur.boundingPosition5).toBe(6);
    expect(ur.boundingPosition3).toBe(9);
  });
});
