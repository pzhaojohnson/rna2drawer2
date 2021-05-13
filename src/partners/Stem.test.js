import {
  bottomPair,
  topPair,
} from './Stem';

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
