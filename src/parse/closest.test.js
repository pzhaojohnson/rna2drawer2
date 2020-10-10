import {
  closestPairOuterTo,
  closestStemOuterTo,
} from './closest';
import { parseDotBracket } from './parseDotBracket';

describe('closestPairOuterTo function', () => {
  it('the position is paired', () => {
    let partners = parseDotBracket('..(((..(((...)))...))).').secondaryPartners;
    // in the 5' side of a stem
    expect(closestPairOuterTo(partners, 8)).toStrictEqual([5, 20]);
    // in the 3' side of a stem
    expect(closestPairOuterTo(partners, 16)).toStrictEqual([5, 20]);
  });

  it('the position is unpaired', () => {
    let partners = parseDotBracket('...(((....(((...)))...))).').secondaryPartners;
    // 5' to a hairpin
    expect(closestPairOuterTo(partners, 9)).toStrictEqual([6, 23]);
    // 3' to a hairpin
    expect(closestPairOuterTo(partners, 21)).toStrictEqual([6, 23]);
  });

  it('there are multiple stems outer to the position', () => {
    let partners = parseDotBracket('.((...((.....((....))..))...).)').secondaryPartners;
    expect(closestPairOuterTo(partners, 11)).toStrictEqual([8, 24]);
  });

  it('there are no pairs outer to the position', () => {
    let partners = parseDotBracket('...(((...))).....((..))....((....))....').secondaryPartners;
    expect(closestPairOuterTo(partners, 15)).toBe(undefined);
  });

  it('there are knots around the position', () => {
    // 5' side of the knot is outer to the 3' side of the knot
    let partners = parseDotBracket('((......((....))..))').secondaryPartners;
    partners[4] = 13;
    partners[12] = 5;
    partners[5] = 12;
    partners[11] = 6;
    expect(closestPairOuterTo(partners, 4)).toStrictEqual([2, 19]);
    // 3' side of the knot is outer to the 5' side of the knot
    partners = parseDotBracket('((..((....))......))').secondaryPartners;
    partners[7] = 16;
    partners[15] = 8;
    partners[8] = 15;
    partners[14] = 9;
    expect(closestPairOuterTo(partners, 17)).toStrictEqual([2, 19]);
  });
});

describe('closestStemOuterTo function', () => {
  it('there is no stem outer to the position', () => {
    let partners = parseDotBracket('.....(((.....)))..').secondaryPartners;
    expect(closestStemOuterTo(partners, 4)).toBe(undefined);
  });

  it('there are multiple stems outer to the position', () => {
    let partners = parseDotBracket('.((....((......(((..)))..)).)..).').secondaryPartners;
    expect(closestStemOuterTo(partners, 12)).toStrictEqual({
      position5: 8,
      position3: 27,
      size: 2,
    });
  });
});
