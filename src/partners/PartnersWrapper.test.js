import { createStem } from 'Partners/stems/Stem';
import { createLinker } from 'Partners/linkers/Linker';

import { PartnersWrapper } from './PartnersWrapper';

describe('PartnersWrapper class', () => {
  test('constructor and partners property', () => {
    let partnersArray = [undefined, 6, null, null, undefined, 2];

    // from a partners array
    let partners = new PartnersWrapper(partnersArray);
    expect(partners.partners).toBe(partnersArray);

    // from another partners wrapper
    partners = new PartnersWrapper(new PartnersWrapper(partnersArray));
    expect(partners.partners).toBe(partnersArray);
  });

  test('partnerOf method', () => {
    let partnersArray = [null, 5, undefined, undefined, 2, undefined];
    let partners = new PartnersWrapper(partnersArray);
    expect(partners.partnerOf(1)).toBe(null);
    expect(partners.partnerOf(2)).toBe(5);
    expect(partners.partnerOf(4)).toBeUndefined();
  });

  test('isUnpaired, isPaired and arePaired methods', () => {
    let partnersArray = [8, 7, null, null, null, null, 2, 1, null];
    let partners = new PartnersWrapper(partnersArray);

    expect(partners.isUnpaired(2)).toBeFalsy();
    expect(partners.isUnpaired(3)).toBeTruthy();

    expect(partners.isPaired(2)).toBeTruthy();
    expect(partners.isPaired(3)).toBeFalsy();

    expect(partners.arePaired(2, 7)).toBeTruthy();
    expect(partners.arePaired(1, 7)).toBeFalsy();
  });

  test('length getter', () => {
    let partnersArray = [undefined, null, undefined, null, null, null, null];
    let partners = new PartnersWrapper(partnersArray);
    expect(partners.length).toBe(7);
  });

  test('pair and unpair methods', () => {
    let partnersArray = [null, null, null, null, null, null, null, null];
    let partners = new PartnersWrapper(partnersArray);

    partners.pair(3, 7);
    expect(partners.partners).toStrictEqual([null, null, 7, null, null, null, 3, null]);

    partners.unpair(7);
    expect(partners.partners).toStrictEqual([null, null, null, null, null, null, null, null]);
  });

  test('pairs method', () => {
    let partnersArray = [null, 6, null, 8, null, 2, null, 4, null];
    let partners = new PartnersWrapper(partnersArray);
    let pairs = partners.pairs();
    let pairTuples = pairs.map(pair => pair.pair);
    expect(pairTuples).toStrictEqual([[2, 6], [4, 8]]);
  });

  test('stems method', () => {
    let partnersArray = [null, 10, 9, 8, null, null, null, 4, 3, 2, 13, null, 11];
    let partners = new PartnersWrapper(partnersArray);
    let stems = partners.stems();
    let stemObjects = stems.map(stem => stem.stem);
    expect(stemObjects).toStrictEqual([
      createStem({ bottomPair: [2, 10], numPairs: 3 }),
      createStem({ bottomPair: [11, 13], numPairs: 1 }),
    ]);
  });

  test('linkers method', () => {
    let partnersArray = [null, null, 8, 7, null, null, 4, 3, null];
    let partners = new PartnersWrapper(partnersArray);
    let linkers = partners.linkers();
    let linkerObjects = linkers.map(linker => linker.linker);
    expect(linkerObjects).toStrictEqual([
      createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 3 }),
      createLinker({ upstreamBoundingPosition: 4, downstreamBoundingPosition: 7 }),
      createLinker({ upstreamBoundingPosition: 8, downstreamBoundingPosition: 10 }),
    ]);
  });
});
