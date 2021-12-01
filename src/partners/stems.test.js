import { unstructuredPartners } from './Partners';

import { stems } from './stems';

describe('stems function', () => {
  test('empty partners', () => {
    let partners = [];
    expect(stems(partners)).toStrictEqual([]);
  });

  test('unstructured partners', () => {
    let partners = unstructuredPartners(10);
    expect(stems(partners)).toStrictEqual([]);
  });

  test('stems of varying sizes', () => {
    let partners = [
      3, null, 1,
      9, 8, null, null, 5, 4,
      19, 18, 17, 16, null, null, 13, 12, 11, 10,
    ];
    expect(stems(partners)).toStrictEqual([
      { position5: 1, position3: 3, size: 1 },
      { position5: 4, position3: 9, size: 2 },
      { position5: 10, position3: 19, size: 4 },
    ]);
  });

  test('a hairpin with a loop that has no unpaired positions', () => {
    let partners = [2, 1];
    expect(stems(partners)).toStrictEqual([
      { position5: 1, position3: 2, size: 1 },
    ]);
  });

  test('leading and trailing positions are unpaired', () => {
    let partners = [null, null, 8, 7, null, null, 4, 3, undefined, undefined];
    expect(stems(partners)).toStrictEqual([
      { position5: 3, position3: 8, size: 2 },
    ]);
  });

  test('leading and trailing positions are paired', () => {
    let partners = [6, 5, null, null, 2, 1, 12, 11, null, null, 8, 7];
    expect(stems(partners)).toStrictEqual([
      { position5: 1, position3: 6, size: 2 },
      { position5: 7, position3: 12, size: 2 },
    ]);
  });

  test('unpaired positions between stems', () => {
    let partners = [
      6, 5, null, null, 2, 1,
      undefined, undefined, null, null,
      16, 15, null, null, 12, 11,
    ];
    expect(stems(partners)).toStrictEqual([
      { position5: 1, position3: 6, size: 2 },
      { position5: 11, position3: 16, size: 2 },
    ]);
  });

  test('no unpaired positions between stems', () => {
    let partners = [
      undefined, undefined,
      8, 7, null, null, 4, 3,
      17, 16, 15, null, null, null, 11, 10, 9,
      null, undefined,
    ];
    expect(stems(partners)).toStrictEqual([
      { position5: 3, position3: 8, size: 2 },
      { position5: 9, position3: 17, size: 3 },
    ]);
  });

  test('a leading knotted stem', () => {
    let partners = [
      null,
      11, 10, 9,
      null,
      14, 13,
      null,
      4, 3, 2,
      null,
      7, 6,
      null,
    ];
    expect(stems(partners)).toStrictEqual([
      { position5: 2, position3: 11, size: 3 },
      { position5: 6, position3: 14, size: 2 },
    ]);
  });

  test('a trailing knotted stem', () => {
    let partners = [
      null,
      11, 10,
      null,
      14, 13, 12,
      null,
      3, 2,
      null,
      7, 6, 5,
      null,
    ];
    expect(stems(partners)).toStrictEqual([
      { position5: 2, position3: 11, size: 2 },
      { position5: 5, position3: 14, size: 3 },
    ]);
  });
});
