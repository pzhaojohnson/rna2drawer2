import { createStem } from 'Partners/stems/Stem';
import { unstructuredPartners } from 'Partners/unstructuredPartners';

import { stemsInPartners } from './stemsInPartners';

describe('stemsInPartners function', () => {
  test('empty partners', () => {
    let partners = [];
    expect(stemsInPartners(partners)).toStrictEqual([]);
  });

  test('unstructured partners', () => {
    let partners = unstructuredPartners(10);
    expect(stemsInPartners(partners)).toStrictEqual([]);
  });

  test('stems with varying numbers of pairs', () => {
    let partners = [
      3, null, 1,
      9, 8, null, null, 5, 4,
      19, 18, 17, 16, null, null, 13, 12, 11, 10,
    ];
    expect(stemsInPartners(partners)).toStrictEqual([
      createStem({ bottomPair: [1, 3], numPairs: 1 }),
      createStem({ bottomPair: [4, 9], numPairs: 2 }),
      createStem({ bottomPair: [10, 19], numPairs: 4 }),
    ]);
  });

  test('a hairpin with a loop that has no unpaired positions', () => {
    let partners = [2, 1];
    expect(stemsInPartners(partners)).toStrictEqual([
      createStem({ bottomPair: [1, 2], numPairs: 1 }),
    ]);
  });

  test('leading and trailing positions are unpaired', () => {
    let partners = [null, null, 8, 7, null, null, 4, 3, undefined, undefined];
    expect(stemsInPartners(partners)).toStrictEqual([
      createStem({ bottomPair: [3, 8], numPairs: 2 }),
    ]);
  });

  test('leading and trailing positions are paired', () => {
    let partners = [6, 5, null, null, 2, 1, 12, 11, null, null, 8, 7];
    expect(stemsInPartners(partners)).toStrictEqual([
      createStem({ bottomPair: [1, 6], numPairs: 2 }),
      createStem({ bottomPair: [7, 12], numPairs: 2 }),
    ]);
  });

  test('unpaired positions between stems', () => {
    let partners = [
      6, 5, null, null, 2, 1,
      undefined, undefined, null, null,
      16, 15, null, null, 12, 11,
    ];
    expect(stemsInPartners(partners)).toStrictEqual([
      createStem({ bottomPair: [1, 6], numPairs: 2 }),
      createStem({ bottomPair: [11, 16], numPairs: 2 }),
    ]);
  });

  test('no unpaired positions between stems', () => {
    let partners = [
      undefined, undefined,
      8, 7, null, null, 4, 3,
      17, 16, 15, null, null, null, 11, 10, 9,
      null, undefined,
    ];
    expect(stemsInPartners(partners)).toStrictEqual([
      createStem({ bottomPair: [3, 8], numPairs: 2 }),
      createStem({ bottomPair: [9, 17], numPairs: 3 }),
    ]);
  });

  test('a leading pseudoknotted stem', () => {
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
    expect(stemsInPartners(partners)).toStrictEqual([
      createStem({ bottomPair: [2, 11], numPairs: 3 }),
      createStem({ bottomPair: [6, 14], numPairs: 2 }),
    ]);
  });

  test('a trailing pseudoknotted stem', () => {
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
    expect(stemsInPartners(partners)).toStrictEqual([
      createStem({ bottomPair: [2, 11], numPairs: 2 }),
      createStem({ bottomPair: [5, 14], numPairs: 3 }),
    ]);
  });
});
