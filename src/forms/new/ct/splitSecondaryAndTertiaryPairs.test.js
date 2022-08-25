import { unstructuredPartners } from 'Partners/unstructuredPartners';

import { splitSecondaryAndTertiaryPairs } from './splitSecondaryAndTertiaryPairs';

describe('splitSecondaryAndTertiaryPairs function', () => {
  test('a structure without pseudoknots', () => {
    let partners = [
      null, null,
      21, 20, 19,
      null,
      17, 16, 15,
      null, null, null, null, null,
      9, 8, 7,
      null,
      5, 4, 3,
    ];

    let {
      secondaryPartners,
      tertiaryPartners,
    } = splitSecondaryAndTertiaryPairs(partners);

    expect(secondaryPartners).toStrictEqual([
      null, null,
      21, 20, 19,
      null,
      17, 16, 15,
      null, null, null, null, null,
      9, 8, 7,
      null,
      5, 4, 3,
    ]);

    expect(tertiaryPartners).toStrictEqual(unstructuredPartners(21));
  });

  test('a structure with pseudoknots', () => {
    let partners = [
      null,
      22, 21, 20, 19, 18, 17,
      null, null,
      26, 25, 24,
      null, null, null, null,
      7, 6, 5, 4, 3, 2,
      null, null, null,
      12, 11, 10,
      null, null, null,
    ];

    let {
      secondaryPartners,
      tertiaryPartners,
    } = splitSecondaryAndTertiaryPairs(partners);

    expect(secondaryPartners).toStrictEqual([
      null,
      22, 21, 20, 19, 18, 17,
      null, null,
      null, null, null,
      null, null, null, null,
      7, 6, 5, 4, 3, 2,
      null, null, null,
      null, null, null,
      null, null, null,
    ]);

    expect(tertiaryPartners).toStrictEqual([
      null,
      null, null, null, null, null, null,
      null, null,
      26, 25, 24,
      null, null, null, null,
      null, null, null, null, null, null,
      null, null, null,
      12, 11, 10,
      null, null, null,
    ]);
  });
});
