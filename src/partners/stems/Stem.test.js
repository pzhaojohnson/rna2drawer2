import { createStem } from './Stem';
import { deepCopyStem } from './Stem';
import { pairsInStem } from './Stem';
import { numPairs } from './Stem';
import { bottomPair } from './Stem';
import { topPair } from './Stem';

test('createStem function', () => {
  // upstream partner of bottom pair before downstream partner
  expect(createStem(
    { bottomPair: [20, 102], size: 6 }
  )).toStrictEqual(
    { position5: 20, position3: 102, size: 6 }
  );

  // upstream partner of bottom pair after downstream partner
  expect(createStem(
    { bottomPair: [102, 20], size: 6 }
  )).toStrictEqual(
    { position5: 20, position3: 102, size: 6 }
  );

  // using numPairs specification property
  expect(createStem(
    { bottomPair: [38, 17], numPairs: 5 }
  )).toStrictEqual(
    { position5: 17, position3: 38, size: 5 }
  );
});

test('deepCopyStem function', () => {
  let stem = { position5: 27, position3: 108, size: 18 };
  let deepCopy = deepCopyStem(stem);
  expect(deepCopy).not.toBe(stem); // is a new object
  expect(deepCopy).toStrictEqual(stem);
});

describe('pairsInStem function', () => {
  test('a stem with more than one pair', () => {
    let stem = createStem({ bottomPair: [47, 21], numPairs: 4 });
    expect(pairsInStem(stem)).toStrictEqual(
      [[21, 47], [22, 46], [23, 45], [24, 44]]
    );
  });

  test('a stem with just one pair', () => {
    let stem = createStem({ bottomPair: [19, 8], numPairs: 1 });
    expect(pairsInStem(stem)).toStrictEqual(
      [[8, 19]]
    );
  });
});

test('numPairs function', () => {
  let stem = createStem({ bottomPair: [80, 200], numPairs: 1 });
  expect(numPairs(stem)).toBe(1); // just one pair

  stem = createStem({ bottomPair: [1, 1000], numPairs: 8 });
  expect(numPairs(stem)).toBe(8); // more than one pair
});

test('bottomPair function', () => {
  // more than one pair in stem
  let stem = createStem({ bottomPair: [76, 24], numPairs: 6 });
  expect(bottomPair(stem)).toStrictEqual([24, 76]);

  // just one pair in stem
  stem = createStem({ bottomPair: [35, 9], numPairs: 1 });
  expect(bottomPair(stem)).toStrictEqual([9, 35]);
});

test('topPair function', () => {
  // more than one pair in stem
  let stem = createStem({ bottomPair: [12, 33], numPairs: 5 });
  expect(topPair(stem)).toStrictEqual([16, 29]);

  // just one pair in stem
  stem = createStem({ bottomPair: [26, 18], numPairs: 1 });
  expect(topPair(stem)).toStrictEqual([18, 26]);
});
