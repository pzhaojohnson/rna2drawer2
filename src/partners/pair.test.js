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
});
