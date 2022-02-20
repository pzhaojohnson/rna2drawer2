import { createStem } from 'Partners/Stem';

import { traverseLoopDownstream } from './traverseLoopDownstream';
import { traverseOutermostLoopDownstream } from './traverseLoopDownstream';

describe('traverseLoopDownstream function', () => {
  describe('traversing the outermost loop', () => {
    test('empty partners', () => {
      let partners = [];
      expect(traverseLoopDownstream(partners)).toStrictEqual({
        positions: [],
      });
    });

    test('unstructured partners', () => {
      let partners = [null, undefined, null, undefined, undefined];
      expect(traverseLoopDownstream(partners)).toStrictEqual({
        positions: [1, 2, 3, 4, 5],
      });
    });

    test('when the first and last positions are paired', () => {
      let partners = [
        6, 5,
        null, null,
        2, 1,
        12, 11,
        null, null,
        8, 7,
      ];
      expect(traverseLoopDownstream(partners)).toStrictEqual({
        positions: [1, 6, 7, 12],
      });
    });

    test('a knot with a hairpin loop', () => {
      let partners = [
        undefined, undefined,
        15, 14, 13, 12,
        null,
        18, 17,
        null, null,
        6, 5, 4, 3,
        undefined,
        9, 8,
        null,
      ];
      expect(traverseLoopDownstream(partners)).toStrictEqual({
        positions: [1, 2, 3, 15, 16, 17, 18, 19],
      });
    });
  });

  describe('traversing not the outermost loop', () => {
    test('a closing stem of size one', () => {
      let partners = [
        null, null,
        8,
        null, null, null, null,
        3,
        undefined,
      ];
      let stem = createStem({ bottomPair: [3, 8], size: 1 });
      expect(traverseLoopDownstream(partners, stem)).toStrictEqual({
        positions: [3, 4, 5, 6, 7, 8],
      });
    });

    test('a loop whose only positions are the top pair of the closing stem', () => {
      let partners = [
        6, 5, 4,
        3, 2, 1,
      ];
      let stem = createStem({ bottomPair: [1, 6], size: 3 });
      expect(traverseLoopDownstream(partners, stem)).toStrictEqual({
        positions: [3, 4],
      });
    });

    test('a hairpin loop', () => {
      let partners = [
        null,
        8, 7,
        undefined, null, undefined,
        3, 2,
      ];
      let stem = createStem({ bottomPair: [2, 8], size: 2 });
      expect(traverseLoopDownstream(partners, stem)).toStrictEqual({
        positions: [3, 4, 5, 6, 7],
      });
    });

    test('when there are no unpaired positions in the loop', () => {
      let partners = [
        14, 13,
        8, 7, 6,
        5, 4, 3,
        12, 11,
        10, 9,
        2, 1,
      ];
      let stem = createStem({ bottomPair: [1, 14], size: 2 });
      expect(traverseLoopDownstream(partners, stem)).toStrictEqual({
        positions: [2, 3, 8, 9, 12, 13],
      });
    });

    test('a knot with an enclosed hairpin loop', () => {
      let partners = [
        undefined, undefined, null,
        22, 21, 20,
        15, 14,
        null, null,
        19, 18, 17,
        8, 7,
        null,
        13, 12, 11,
        6, 5, 4,
        null,
      ];
      let stem = createStem({ bottomPair: [4, 22], size: 3 });
      expect(traverseLoopDownstream(partners, stem)).toStrictEqual({
        positions: [6, 7, 15, 16, 17, 18, 19, 20],
      });
    });

    test('a knot with positions before the closing stem', () => {
      let partners = [
        10, 9, 8,
        undefined,
        12, 11,
        null,
        3, 2, 1,
        6, 5,
        null,
      ];
      let stem = createStem({ bottomPair: [5, 12], size: 2 });
      expect(traverseLoopDownstream(partners, stem)).toStrictEqual({
        positions: [6, 7, 8, 9, 10, 11],
      });
    });

    test('a knot with positions after the closing stem', () => {
      let partners = [
        14, 13, 12, 11,
        null,
        18, 17, 16,
        null, null,
        4, 3, 2, 1,
        undefined,
        8, 7, 6,
        undefined, null,
      ];
      let stem = createStem({ bottomPair: [1, 14], size: 4 });
      expect(traverseLoopDownstream(partners, stem)).toStrictEqual({
        positions: [4, 5, 6, 7, 8, 9, 10, 11],
      });
    });
  });
});

test('traverseOutermostLoopDownstream function', () => {
  let partners = [
    null, null,
    10, 9, 8,
    undefined, null,
    5, 4, 3,
    undefined,
  ];
  expect(
    traverseOutermostLoopDownstream(partners)
  ).toStrictEqual(
    traverseLoopDownstream(partners)
  );
});
