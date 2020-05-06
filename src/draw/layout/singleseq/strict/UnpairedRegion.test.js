import UnpairedRegion from './UnpairedRegion';
import GeneralStrictLayoutProps from './GeneralStrictLayoutProps';
import PerBaseStrictLayoutProps from './PerBaseStrictLayoutProps';
import Stem from './Stem';
import { baseCoordinatesRound } from './UnpairedRegionRound';
import baseCoordinatesFlatOutermostLoop from './UnpairedRegionFlatOutermostLoop';
import parseDotBracket from '../../../../parse/parseDotBracket';
import { StemLayout } from './StemLayout';

function defaultPerBaseProps(length) {
  let pbps = [];
  for (let i = 0; i < length; i++) {
    pbps.push(new PerBaseStrictLayoutProps());
  }
  return pbps;
}

it('basic test of constructor', () => {
  let partners = [3, null, 1, 6, null, 4];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(6);
  let st5 = new Stem(1, partners, gps, pbps);
  let st3 = new Stem(4, partners, gps, pbps);
  expect(
    () => new UnpairedRegion(st5, st3, partners, gps, pbps)
  ).not.toThrow();
});

it('bounding stem getters', () => {
  let partners = [6, 5, null, null, 2, 1];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(6);
  let st = new Stem(1, partners, gps, pbps);
  let it = st.loopIterator();
  let ur = it.next().value;
  expect(Object.is(ur.boundingStem5, st)).toBeTruthy();
  expect(Object.is(ur.boundingStem3, st)).toBeTruthy();
});

it("5' and 3' bounding position getters - hairpin loop", () => {
  let partners = [6, 5, null, null, 2, 1];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(6);
  let st = new Stem(1, partners, gps, pbps);
  let it = st.loopIterator();
  let ur = it.next().value;
  expect(ur.boundingPosition5).toBe(2);
  expect(ur.boundingPosition3).toBe(5);
});

it("5' and 3' bounding position getters - 5' stem is outer", () => {
  let partners = [11, 10, null, 8, 7, null, 5, 4, null, 2, 1];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(11);
  let ost = new Stem(1, partners, gps, pbps);
  let it = ost.loopIterator();
  let ur = it.next().value;
  expect(ur.boundingPosition5).toBe(2);
  expect(ur.boundingPosition3).toBe(4);
});

it("5' and 3' bounding position getters - 3' stem is outer", () => {
  let partners = [11, 10, null, 8, 7, null, 5, 4, null, 2, 1];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(11);
  let ost = new Stem(1, partners, gps, pbps);
  let it = ost.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;
  expect(ur.boundingPosition5).toBe(8);
  expect(ur.boundingPosition3).toBe(10);
});

it("5' and 3' bounding position getters - neither stem is outer", () => {
  let partners = [5, 4, null, 2, 1, null, 11, 10, null, 8, 7];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(11);
  let omst = new Stem(0, partners, gps, pbps);
  let it = omst.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;
  expect(ur.boundingPosition5).toBe(5);
  expect(ur.boundingPosition3).toBe(7);
});

it("5' and 3' bounding stem outward angle getters - hairpin loop", () => {
  let partners = [3, null, 1];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(3);
  let st = new Stem(1, partners, gps, pbps);
  st.angle = Math.PI / 3;
  let it = st.loopIterator();
  let ur = it.next().value;
  expect(ur.boundingStemOutwardAngle5).toBeCloseTo(st.reverseAngle, 3);
  expect(ur.boundingStemOutwardAngle3).toBeCloseTo(st.reverseAngle, 3);
});

it("5' and 3' bounding stem outward angle getters - 5' stem is outer", () => {
  let partners = [8, null, 6, null, null, 3, null, 1];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(8);
  let ost = new Stem(1, partners, gps, pbps);
  ost.angle = -Math.PI / 8;
  let it = ost.loopIterator();
  let ur = it.next().value;
  let ist = it.next().value;
  expect(ur.boundingStemOutwardAngle5).toBeCloseTo(ost.reverseAngle, 3);
  expect(ur.boundingStemOutwardAngle3).toBeCloseTo(ist.angle, 3);
});

it("5' and 3' bounding stem outward angle getters - 3' stem is outer", () => {
  let partners = [8, null, 6, null, null, 3, null, 1];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(8);
  let ost = new Stem(1, partners, gps, pbps);
  let it = ost.loopIterator();
  it.next();
  let ist = it.next().value;
  let ur = it.next().value;
  ost.angle = -Math.PI / 8;
  ist.angle = -Math.PI / 8;
  expect(ur.boundingStemOutwardAngle5).toBeCloseTo(ist.angle, 3);
  expect(ur.boundingStemOutwardAngle3).toBeCloseTo(ost.reverseAngle, 3);
});

it("5' and 3' bounding stem outward angle getters - neither stem is outer", () => {
  let partners = [3, null, 1, 6, null, 4];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(6);
  let omst = new Stem(0, partners, gps, pbps);
  let it = omst.loopIterator();
  it.next();
  let st5 = it.next().value;
  let ur = it.next().value;
  let st3 = it.next().value;
  st5.angle = -2 * Math.PI / 3;
  st3.angle = -Math.PI / 3;
  expect(ur.boundingStemOutwardAngle5).toBeCloseTo(st5.angle, 3);
  expect(ur.boundingStemOutwardAngle3).toBeCloseTo(st3.angle, 3);
});

it("5' and 3' bounding base coordinates - hairpin loop", () => {
  let partners = [6, 5, null, null, 2, 1];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(6);
  let st = new Stem(1, partners, gps, pbps);
  let it = st.loopIterator();
  let ur = it.next().value;
  
  let bcb5 = ur.baseCoordinatesBounding5();
  let ebcb5 = st.baseCoordinatesTop5();
  expect(bcb5.xLeft).toBeCloseTo(ebcb5.xLeft, 3);
  expect(bcb5.yTop).toBeCloseTo(ebcb5.yTop, 3);

  let bcb3 = ur.baseCoordinatesBounding3();
  let ebcb3 = st.baseCoordinatesTop3();
  expect(bcb3.xLeft).toBeCloseTo(ebcb3.xLeft, 3);
  expect(bcb3.yTop).toBeCloseTo(ebcb3.yTop, 3);
});

it("5' and 3' bounding base coordinates - 5' stem is outer", () => {
  let partners = [11, 10, null, 8, 7, null, 5, 4, null, 2, 1];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(11);
  let ost = new Stem(1, partners, gps, pbps);
  let it = ost.loopIterator();
  let ur = it.next().value;
  let ist = it.next().value;

  let bcb5 = ur.baseCoordinatesBounding5();
  let ebcb5 = ost.baseCoordinatesTop5();
  expect(bcb5.xLeft).toBeCloseTo(ebcb5.xLeft, 3);
  expect(bcb5.yTop).toBeCloseTo(ebcb5.yTop, 3);

  let bcb3 = ur.baseCoordinatesBounding3();
  let ebcb3 = ist.baseCoordinates5();
  expect(bcb3.xLeft).toBeCloseTo(ebcb3.xLeft, 3);
  expect(bcb3.yTop).toBeCloseTo(ebcb3.yTop, 3);
});

it("5' and 3' bounding base coordinates - 3' stem is outer", () => {
  let partners = [11, 10, null, 8, 7, null, 5, 4, null, 2, 1];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(11);
  let ost = new Stem(1, partners, gps, pbps);
  let it = ost.loopIterator();
  it.next();
  let ist = it.next().value;
  let ur = it.next().value;
  
  let bcb5 = ur.baseCoordinatesBounding5();
  let ebcb5 = ist.baseCoordinates3();
  expect(bcb5.xLeft).toBeCloseTo(ebcb5.xLeft, 3);
  expect(bcb5.yTop).toBeCloseTo(ebcb5.yTop, 3);

  let bcb3 = ur.baseCoordinatesBounding3();
  let ebcb3 = ost.baseCoordinatesTop3();
  expect(bcb3.xLeft).toBeCloseTo(ebcb3.xLeft, 3);
  expect(bcb3.yTop).toBeCloseTo(ebcb3.yTop, 3);
});

it("5' and 3' bounding base coordinates - neither stem is outer", () => {
  let partners = [5, 4, null, 2, 1, null, 11, 10, null, 8, 7];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(11);
  let omst = new Stem(0, partners, gps, pbps);
  let it = omst.loopIterator();
  it.next();
  let st5 = it.next().value;
  let ur = it.next().value;
  let st3 = it.next().value;

  let bcb5 = ur.baseCoordinatesBounding5();
  let ebcb5 = st5.baseCoordinates3();
  expect(bcb5.xLeft).toBeCloseTo(ebcb5.xLeft, 3);
  expect(bcb5.yTop).toBeCloseTo(ebcb5.yTop, 3);

  let bcb3 = ur.baseCoordinatesBounding3();
  let ebcb3 = st3.baseCoordinates5();
  expect(bcb3.xLeft).toBeCloseTo(ebcb3.xLeft, 3);
  expect(bcb3.yTop).toBeCloseTo(ebcb3.yTop, 3);
});

it('size getter - size of zero', () => {
  let partners = [3, null, 1, 6, null, 4];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(6);
  let omst = new Stem(0, partners, gps, pbps);
  let it = omst.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;
  expect(ur.size).toBe(0);
});

it('size getter - size greater than zero', () => {
  let partners = [3, null, 1, null, null, 8, null, 6];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(8);
  let omst = new Stem(0, partners, gps, pbps);
  let it = omst.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;
  expect(ur.size).toBe(2);
});

it('isHairpinLoop method - is a hairpin loop', () => {
  let partners = [3, null, 1];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(3);
  let st = new Stem(1, partners, gps, pbps);
  let it = st.loopIterator();
  let ur = it.next().value;
  expect(ur.isHairpinLoop()).toBeTruthy();
});

it('isHairpinLoop method - is not a hairpin loop', () => {
  let partners = [3, null, 1, null, 7, null, 5];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(7);
  let omst = new Stem(0, partners, gps, pbps);
  let it = omst.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;
  expect(ur.isHairpinLoop()).toBeFalsy();
});

it('isDangling5 and isDangling3 methods', () => {
  let partners = [null, 7, 6, null, null, 3, 2, null, 11, null, 9];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(11);
  let outermostStem = new Stem(0, partners, gps, pbps);
  let it = outermostStem.loopIterator();

  let ur = it.next().value;
  expect(ur.isDangling5()).toBeTruthy();
  expect(ur.isDangling3()).toBeFalsy();

  it.next();
  ur = it.next().value;
  expect(ur.isDangling5()).toBeFalsy();
  expect(ur.isDangling3()).toBeFalsy();

  it.next();
  ur = it.next().value;
  expect(ur.isDangling5()).toBeFalsy();
  expect(ur.isDangling3()).toBeTruthy();
});

it('length getter - size of zero', () => {
  let partners = [];
  let gps = new GeneralStrictLayoutProps();
  let pbps = [];
  let omst = new Stem(0, partners, gps, pbps);
  let it = omst.loopIterator();
  let ur = it.next().value;
  expect(ur.length).toBe(0);
});

it('length getter - positive size', () => {
  let partners = [3, null, 1, null, null, 8, null, 6];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(8);
  pbps[3].stretch3 = 5;
  pbps[4].stretch3 = 6;
  pbps[5].stretch3 = 8;
  let omst = new Stem(0, partners, gps, pbps);
  let it = omst.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;
  expect(ur.length).toBeCloseTo(13, 3);
});

it("length getter - includes 3' stretch of 5' bounding position", () => {
  let partners = [3, null, 1, null, null, 8, null, 6];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(8);
  pbps[2].stretch3 = 1.5;
  pbps[3].stretch3 = 5;
  pbps[4].stretch3 = 6;
  pbps[5].stretch3 = 8;
  let omst = new Stem(0, partners, gps, pbps);
  let it = omst.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;
  expect(ur.length).toBeCloseTo(14.5, 3);
});

it("length getter - 5' bounding position is zero", () => {
  let partners = [null, null, null];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(3);
  pbps[0].stretch3 = 0.5;
  pbps[1].stretch3 = 1.9;
  pbps[2].stretch3 = -0.2;
  let omst = new Stem(0, partners, gps, pbps);
  let it = omst.loopIterator();
  let ur = it.next().value;
  expect(ur.length).toBeCloseTo(5.2, 3);
});

it('length getter - does not return a negative length', () => {
  let partners = [3, null, 1, null, null, 8, null, 6];
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(8);
  pbps[2].stretch3 = 1.5;
  pbps[3].stretch3 = 5;
  pbps[4].stretch3 = -600;
  pbps[5].stretch3 = 8;
  let omst = new Stem(0, partners, gps, pbps);
  let it = omst.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;
  expect(ur.length).toBeCloseTo(0, 3);
});

function checkCoords(coords, expectedCoords) {
  expect(coords.length).toBe(expectedCoords.length);
  for (let i = 0; i < expectedCoords.length; i++) {
    expect(coords[i].xLeft).toBeCloseTo(expectedCoords[i].xLeft);
    expect(coords[i].yTop).toBeCloseTo(expectedCoords[i].yTop);
  }
}

it('baseCoordinates method - size of zero', () => {
  let partners = [];
  let gps = new GeneralStrictLayoutProps();
  let pbps = [];
  let omst = new Stem(0, partners, gps, pbps);
  let it = omst.loopIterator();
  let ur = it.next().value;
  checkCoords(ur.baseCoordinates(), []);
});

it('baseCoordinates method - in a flat outermost loop', () => {
  let partners = [3, null, 1, null, null, null, null, null, 11, null, 9];
  let gps = new GeneralStrictLayoutProps();
  gps.flatOutermostLoop = true;
  let pbps = defaultPerBaseProps(11);
  pbps[2].stretch3 = 2;
  pbps[2].flatOutermostLoopAngle3 = Math.PI / 3;
  pbps[3].stretch3 = 0;
  pbps[4].stretch3 = 4;
  pbps[5].flatOutermostLoopAngle3 = -Math.PI / 5;
  let omst = new Stem(0, partners, gps, pbps);
  let it = omst.loopIterator();
  it.next();
  let st5 = it.next();
  let ur = it.next().value;
  
  st5.xBottomCenter = 1;
  st5.yBottomCenter = 2;
  st5.angle = -5 * Math.PI / 9;
  checkCoords(
    ur.baseCoordinates(true),
    baseCoordinatesFlatOutermostLoop(ur, gps, pbps),
  );
});

it('baseCoordinates - in a round outermost loop', () => {
  let partners = parseDotBracket('....').secondaryPartners;
  let gps = new GeneralStrictLayoutProps();
  gps.flatOutermostLoop = false;
  let pbps = defaultPerBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, pbps);
  StemLayout.setCoordinatesAndAngles(omst, gps, pbps);
  let it = omst.loopIterator();
  let ur = it.next().value;
  checkCoords(
    ur.baseCoordinates(),
    baseCoordinatesRound(ur, gps),
  );
});

it('baseCoordinates - is not in the flat outermost loop', () => {
  let partners = parseDotBracket('..(((...))).').secondaryPartners;
  let gps = new GeneralStrictLayoutProps();
  gps.flatOutermostLoop = true;
  let pbps = defaultPerBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, pbps);
  StemLayout.setCoordinatesAndAngles(omst, gps, pbps);
  let omit = omst.loopIterator();
  omit.next();
  let st = omit.next().value;
  let stit = st.loopIterator();
  let ur = stit.next().value;
  checkCoords(
    ur.baseCoordinates(),
    baseCoordinatesRound(ur, gps),
  );
});

it('baseCoordinates method - in an inner round loop', () => {
  let partners = parseDotBracket('.(((...((...)).)))....').secondaryPartners;
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, pbps);
  StemLayout.setCoordinatesAndAngles(omst, gps, pbps);
  let omit = omst.loopIterator();
  omit.next();
  let st = omit.next().value;
  let stit = st.loopIterator();
  let ur = stit.next().value;
  checkCoords(
    ur.baseCoordinates(),
    baseCoordinatesRound(ur, gps),
  );
});
