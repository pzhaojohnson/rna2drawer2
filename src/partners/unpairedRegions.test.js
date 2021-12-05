import { unpairedRegions } from './unpairedRegions';

describe('unpairedRegions function', () => {
  test('empty partners', () => {
    let partners = [];
    expect(unpairedRegions(partners)).toStrictEqual([]);
  });

  test('unstructured partners of length greater than zero', () => {
    let partners = [undefined, null, undefined, null, undefined];
    expect(unpairedRegions(partners)).toStrictEqual([
      { boundingPosition5: 0, boundingPosition3: 6 },
    ]);
  });

  test('first and last positions are in stems', () => {
    let partners = [6, 5, null, null, 2, 1];
    // omits leading and trailing unpaired regions of size zero
    expect(unpairedRegions(partners)).toStrictEqual([
      { boundingPosition5: 2, boundingPosition3: 5 },
    ]);
  });

  test('first and last positions are unpaired', () => {
    let partners = [
      null, null,
      8, 7, undefined, undefined, 4, 3,
      undefined, undefined,
    ];
    // includes leading and trailing unpaired regions
    expect(unpairedRegions(partners)).toStrictEqual([
      { boundingPosition5: 0, boundingPosition3: 3 },
      { boundingPosition5: 4, boundingPosition3: 7 },
      { boundingPosition5: 8, boundingPosition3: 11 },
    ]);
  });

  test('internal unpaired regions of varying sizes', () => {
    let partners = [
      6, 5, null, undefined, 2, 1,
      9, null, 7,
      null,
      18, 17, 16, undefined, null, 13, 12, 11,
      undefined, undefined, null, undefined,
      30, 29, null, null, null, undefined, 24, 23,
    ];
    expect(unpairedRegions(partners)).toStrictEqual([
      { boundingPosition5: 2, boundingPosition3: 5 },
      { boundingPosition5: 6, boundingPosition3: 7 },
      { boundingPosition5: 7, boundingPosition3: 9 },
      { boundingPosition5: 9, boundingPosition3: 11 },
      { boundingPosition5: 13, boundingPosition3: 16 },
      { boundingPosition5: 18, boundingPosition3: 23 },
      { boundingPosition5: 24, boundingPosition3: 29 },
    ]);
  });

  test('a leading pseudoknot', () => {
    let partners = [
      8, 7,
      null,
      12, 11, 10,
      2, 1,
      undefined,
      6, 5, 4,
    ];
    expect(unpairedRegions(partners)).toStrictEqual([
      { boundingPosition5: 2, boundingPosition3: 4 },
      { boundingPosition5: 6, boundingPosition3: 7 },
      { boundingPosition5: 8, boundingPosition3: 10 },
    ]);
  });

  test('a trailing pseudoknot', () => {
    let partners = [
      11, 10,
      undefined, undefined,
      14, 13, 12,
      null, null,
      2, 1,
      7, 6, 5,
    ];
    expect(unpairedRegions(partners)).toStrictEqual([
      { boundingPosition5: 2, boundingPosition3: 5 },
      { boundingPosition5: 7, boundingPosition3: 10 },
      { boundingPosition5: 11, boundingPosition3: 12 },
    ]);
  });
});
