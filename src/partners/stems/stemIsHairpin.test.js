import { createStem } from 'Partners/stems/Stem';

import { stemIsHairpin } from './stemIsHairpin';

describe('stemIsHairpin function', () => {
  test('a hairpin with loop of size zero', () => {
    let partners = [
      null, null, null,
      9, 8, 7,
      6, 5, 4,
      null, null,
    ];
    let stem = createStem({ bottomPair: [4, 9], numPairs: 3 });
    expect(stemIsHairpin(partners, stem)).toBeTruthy();
  });

  test('a hairpin with loop of size greater than zero', () => {
    let partners = [
      null, null, null,
      14, 13, 12,
      null, null, null, null, null,
      6, 5, 4,
      null, null,
    ];
    let stem = createStem({ bottomPair: [4, 14], numPairs: 3 });
    expect(stemIsHairpin(partners, stem)).toBeTruthy();
  });

  test('a hairpin whose leading enclosed positions are paired', () => {
    let partners = [
      null, null,
      12, 11,
      null, null,
      18, 17, 16, 15,
      4, 3,
      null, null,
      10, 9, 8, 7,
    ];
    let stem = createStem({ bottomPair: [7, 18], numPairs: 4 });
    expect(stemIsHairpin(partners, stem)).toBeFalsy();
  });

  test('a hairpin whose trailing enclosed positions are paired', () => {
    let partners = [
      null, null,
      14, 13,
      null, null,
      18, 17, 16, 15,
      null, null,
      4, 3,
      10, 9, 8, 7,
    ];
    let stem = createStem({ bottomPair: [7, 18], numPairs: 4 });
    expect(stemIsHairpin(partners, stem)).toBeFalsy();
  });
});