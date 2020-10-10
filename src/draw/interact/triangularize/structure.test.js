import { positionsOfLoop, positionsOfOutermostLoop } from './structure';
import { parseDotBracket } from '../../../parse/parseDotBracket';

describe('positionsOfLoop function', () => {
  describe('handling knots', () => {
    it("5' side of knot is in loop", () => {
      let partners = parseDotBracket('.(((....)))....').secondaryPartners;
      partners[5] = 14;
      partners[13] = 6;
      partners[6] = 13;
      partners[12] = 7;
      let st = { position5: 2, position3: 11, size: 3 };
      expect(positionsOfLoop(partners, st)).toStrictEqual(
        [5, 6, 7, 8]
      );
    });

    it("3' side of knot is in loop", () => {
      let partners = parseDotBracket('......((((.....))))...').secondaryPartners;
      partners[1] = 14;
      partners[13] = 2;
      partners[2] = 13;
      partners[12] = 3;
      let st = { position5: 7, position3: 19, size: 4 };
      expect(positionsOfLoop(partners, st)).toStrictEqual(
        [11, 12, 13, 14, 15]
      );
    });
  });
});

describe('positionsOfOutermostLoop function', () => {
  it('first and last positions are unpaired', () => {
    let partners = parseDotBracket('..((..))...((((..)))).').secondaryPartners;
    expect(positionsOfOutermostLoop(partners)).toStrictEqual(
      [1, 2, 3, 8, 9, 10, 11, 12, 21, 22]
    );
  });

  it('first and last positions are paired', () => {
    let partners = parseDotBracket('((..))...(.)....(((...)))').secondaryPartners;
    expect(positionsOfOutermostLoop(partners)).toStrictEqual(
      [1, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 25]
    );
  });
});
