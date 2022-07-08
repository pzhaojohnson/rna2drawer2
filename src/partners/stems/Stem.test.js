import { createStem } from './Stem';
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

describe('pairsInStem function', () => {
  it('stem of size greater than one', () => {
    let st = { position5: 21, position3: 47, size: 4 };
    expect(pairsInStem(st)).toStrictEqual(
      [[21, 47], [22, 46], [23, 45], [24, 44]]
    );
  });

  it('stem of size one', () => {
    let st = { position5: 8, position3: 19, size: 1 };
    expect(pairsInStem(st)).toStrictEqual(
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

it('bottomPair function', () => {
  let st = { position5: 24, position3: 76, size: 6 };
  expect(bottomPair(st)).toStrictEqual([24, 76]);
});

it('topPair function', () => {
  // size greater than one
  let st = { position5: 12, position3: 33, size: 5 };
  expect(topPair(st)).toStrictEqual([16, 29]);
  // size of one
  st = { position5: 18, position3: 26, size: 1 };
  expect(topPair(st)).toStrictEqual([18, 26]);
});
