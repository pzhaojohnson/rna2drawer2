import { knottedWith } from './knottedWith';

describe('knottedWith function', () => {
  it('empty partners', () => {
    expect(
      knottedWith([], [6, 12])
    ).toStrictEqual([]);
  });

  it('unstructured partners', () => {
    let partners = [undefined, null, null, undefined, undefined];
    expect(
      knottedWith(partners, [2, 4])
    ).toStrictEqual([]);
  });

  it('no pairs are knotted with the given pair', () => {
    let partners = [null, 12, 11, null, 9, null, null, undefined, 5, null, 3, 2];
    expect(
      knottedWith(partners, [4, 10])
    ).toStrictEqual([]);
  });

  it('there are knotted pairs', () => {
    let partners = [5, 6, undefined, null, 1, 2, 10, null, undefined, 7];
    expect(
      knottedWith(partners, [4, 8])
    ).toStrictEqual(
      // knottedWith function must check all positions between 4 and 8
      // to be able to return all knotted pairs
      [[5, 1], [6, 2], [7, 10]]
    );
  });

  it("doesn't return the given pair", () => {
    let partners = [null, 6, 7, null, undefined, 2, 3, null];
    expect(
      knottedWith(partners, [3, 7]) // pair is in partners
    ).toStrictEqual([[6, 2]]);
  });

  it('downstream partner is given first in the pair', () => {
    let partners = [5, 6, undefined, null, 1, 2, 10, null, undefined, 7];
    expect(
      knottedWith(partners, [8, 4])
    ).toStrictEqual([[5, 1], [6, 2], [7, 10]]);
  });
});
