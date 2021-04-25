import {
  pair,
  unpair,
} from './pair';

describe('pair function', () => {
  it('pairs the two positions', () => {
    let partners = [null, undefined, undefined, null, null, null, undefined];
    pair(partners, 3, 6);
    expect(partners).toStrictEqual(
      [null, undefined, 6, null, null, 3, undefined]
    );
  });

  it('removes any preexisting pairs involving the two positions', () => {
    let partners = [null, 8, null, 10, undefined, undefined, null, 2, null, 4, undefined, undefined];
    pair(partners, 2, 10);
    expect(partners).toStrictEqual(
      [null, 10, null, null, undefined, undefined, null, null, null, 2, undefined, undefined]
    );
  });

  it("the order of the two positions doesn't matter", () => {
    let partners = [null, null, null, null, null, null, null, null, null, null];
    pair(partners, 2, 9); // smaller position first
    pair(partners, 7, 3); // larger position first
    expect(partners).toStrictEqual(
      [null, 9, 7, null, null, null, 3, null, 2, null]
    );
  });

  it('can add pair to empty partners notation', () => {
    let partners = [];
    pair(partners, 3, 8);
    let expected = [];
    expected[3 - 1] = 8;
    expected[8 - 1] = 3;
    expect(partners).toStrictEqual(expected);
  });

  it('can add pair above bounds', () => {
    let partners = [null, undefined, null, undefined, null];
    let expected = [null, undefined, null, undefined, null];
    pair(partners, 3, 9); // second position is above bounds
    expected[3 - 1] = 9;
    expected[9 - 1] = 3;
    expect(partners).toStrictEqual(expected);
    pair(partners, 12, 2); // first position is above bounds
    expected[12 - 1] = 2;
    expected[2 - 1] = 12;
    expect(partners).toStrictEqual(expected);
    pair(partners, 15, 22); // both positions are above bounds
    expected[15 - 1] = 22;
    expected[22 - 1] = 15;
    expect(partners).toStrictEqual(expected);
  });
});

describe('unpair function', () => {
  it('removes pair', () => {
    let partners = [null, 10, 9, 8, null, undefined, undefined, 4, 3, 2];
    unpair(partners, 3); // position is upstream partner
    expect(partners).toStrictEqual(
      [null, 10, null, 8, null, undefined, undefined, 4, null, 2]
    );
    unpair(partners, 8); // position is downstream partner
    expect(partners).toStrictEqual(
      [null, 10, null, null, null, undefined, undefined, null, null, 2]
    );
  });

  it('position is already unpaired', () => {
    let partners = [null, undefined, undefined, null, null];
    unpair(partners, 3);
    expect(partners).toStrictEqual(
      // okay to change undefined to null at position 3
      [null, undefined, null, null, null]
    );
  });

  it('handles empty partners notation', () => {
    let partners = [];
    unpair(partners, 3);
    let expected = [];
    expected[3 - 1] = null; // will assign null at position 3
    expect(partners).toStrictEqual(expected);
  });

  it('handles position above bounds', () => {
    let partners = [null, 6, null, null, undefined, 2, undefined];
    let expected = [null, 6, null, null, undefined, 2, undefined];
    unpair(partners, 12);
    expected[12 - 1] = null;
    expect(partners).toStrictEqual(expected);
  });
});
