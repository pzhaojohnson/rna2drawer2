import { createStem } from 'Partners/stems/Stem';

import { stemsAreEqual } from './stemsAreEqual';

test('stemsAreEqual function', () => {
  // are equal (and different bottom pair order)
  expect(stemsAreEqual(
    createStem({ bottomPair: [12, 31], numPairs: 6 }),
    createStem({ bottomPair: [31, 12], numPairs: 6 }),
  )).toBeTruthy();

  // different bottom pair upstream partners
  expect(stemsAreEqual(
    createStem({ bottomPair: [12, 31], numPairs: 6 }),
    createStem({ bottomPair: [11, 31], numPairs: 6 }),
  )).toBeFalsy();

  // different bottom pair downstream partners
  expect(stemsAreEqual(
    createStem({ bottomPair: [12, 32], numPairs: 6 }),
    createStem({ bottomPair: [12, 31], numPairs: 6 }),
  )).toBeFalsy();

  // different numbers of pairs
  expect(stemsAreEqual(
    createStem({ bottomPair: [12, 31], numPairs: 6 }),
    createStem({ bottomPair: [12, 31], numPairs: 5 }),
  )).toBeFalsy();
});
