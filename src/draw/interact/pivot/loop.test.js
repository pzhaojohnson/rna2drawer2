import {
  unpairedRegionBefore,
  unpairedRegionAfter,
} from './loop';
import { parseDotBracket } from '../../../parse/parseDotBracket';

describe('unpairedRegionBefore function', () => {
  describe('unpaired region has size of zero', () => {
    it("5' bounding position is zero", () => {
      let partners = parseDotBracket('((..))').secondaryPartners;
      let st = { position5: 1, position3: 6, size: 2 };
      expect(unpairedRegionBefore(partners, st)).toStrictEqual(
        { boundingPosition5: 0, boundingPosition3: 1 }
      );
    });

    it("5' bounding position is greater than zero", () => {
      let partners = parseDotBracket('((..))((...))').secondaryPartners;
      let st = { position5: 7, position3: 13, size: 2};
      expect(unpairedRegionBefore(partners, st)).toStrictEqual(
        { boundingPosition5: 6, boundingPosition3: 7 }
      );
    });
  });

  describe('unpaired region has size greater than zero', () => {
    it("5' bounding position is zero", () => {
      let partners = parseDotBracket('...(.)').secondaryPartners;
      let st = { position5: 4, position3: 6, size: 1};
      expect(unpairedRegionBefore(partners, st)).toStrictEqual(
        { boundingPosition5: 0, boundingPosition3: 4 }
      );
    });

    it("5' bounding position is greater than zero", () => {
      let partners = parseDotBracket('((..))...((...))').secondaryPartners;
      let st = { position5: 10, position3: 16, size: 2};
      expect(unpairedRegionBefore(partners, st)).toStrictEqual(
        { boundingPosition5: 6, boundingPosition3: 10 }
      );
    });
  });
});

describe('unpairedRegionAfter function', () => {
  describe('unpaired region has size of zero', () => {
    it("3' bounding position is out of range", () => {
      let partners = parseDotBracket('((..))').secondaryPartners;
      let st = { position5: 1, position3: 6, size: 2 };
      expect(unpairedRegionAfter(partners, st)).toStrictEqual(
        { boundingPosition5: 6, boundingPosition3: 7 }
      );
    });

    it("3' bounding position is in range", () => {
      let partners = parseDotBracket('((..))((...))').secondaryPartners;
      let st = { position5: 1, position3: 6, size: 2};
      expect(unpairedRegionAfter(partners, st)).toStrictEqual(
        { boundingPosition5: 6, boundingPosition3: 7 }
      );
    });
  });

  describe('unpaired region has size greater than zero', () => {
    it("3' bounding position is out of range", () => {
      let partners = parseDotBracket('..(((..)))....').secondaryPartners;
      let st = { position5: 3, position3: 10, size: 3 };
      expect(unpairedRegionAfter(partners, st)).toStrictEqual(
        { boundingPosition5: 10, boundingPosition3: 15 }
      );
    });

    it("3' bounding position is in range", () => {
      let partners = parseDotBracket('..(((..)))..((...))').secondaryPartners;
      let st = { position5: 3, position3: 10, size: 3 };
      expect(unpairedRegionAfter(partners, st)).toStrictEqual(
        { boundingPosition5: 10, boundingPosition3: 13 }
      );
    });
  });
});
