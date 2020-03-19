import { RoundLoop, TriangleLoop, FlatOutermostLoop, StemLayout } from './StemLayout';
import StrictLayoutGeneralProps from './StrictLayoutGeneralProps';
import StrictLayoutBaseProps from './StrictLayoutBaseProps';
import Stem from './Stem';
import normalizeAngle from '../../../normalizeAngle';
import { circleCenter } from './circle';
import baseCoordinatesTriangularRound from './UnpairedRegionTriangularRound';

function defaultBaseProps(length) {
  let bps = [];
  for (let i = 0; i < length; i++) {
    bps.push(new StrictLayoutBaseProps());
  }
  return bps;
}

function checkCoords(coords, expectedCoords) {
  expect(coords.length).toBe(expectedCoords.length);
  for (let i = 0; i < expectedCoords.length; i++) {
    expect(coords[i].xLeft).toBeCloseTo(expectedCoords[i][0]);
    expect(coords[i].yTop).toBeCloseTo(expectedCoords[i][1]);
  }
}

it('RoundLoop xCenter and yCenter', () => {
  let partners = [12, 11, null, 10, 9, null, null, null, 5, 4, 2, 1];
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  bps[0].loopShape = 'round';
  bps[2].stretch3 = 12.5;

  let st = new Stem(1, partners, gps, bps);
  st.angle = Math.PI / 3;
  st.xBottomCenter = 1.3;
  st.yBottomCenter = -3.4;

  let cc = circleCenter(
    st.xTopLeft,
    st.yTopLeft,
    st.xTopRight,
    st.yTopRight,
    st.loopLength,
  );
  expect(RoundLoop.xCenter(st)).toBeCloseTo(cc.x, 3);
  expect(RoundLoop.yCenter(st)).toBeCloseTo(cc.y, 3);
});

it('RoundLoop setCoordinatesAndAngles - sets properties of outermost stem', () => {
  let partners = [null, 4, null, 2, null];
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);

  let outermostStem = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(outermostStem, gps, bps);
  expect(outermostStem.xBottomCenter).toBeCloseTo(0, 3);
  expect(outermostStem.yBottomCenter).toBeCloseTo(0, 3);
  expect(outermostStem.angle).toBeCloseTo(-Math.PI / 2, 3);
});

it('RoundLoop setCoordinatesAndAngles - uses rotation of layout', () => {
  let partners = [null, 4, null, 2, null];
  let gps = new StrictLayoutGeneralProps();
  gps.rotation = -Math.PI / 7;
  let bps = defaultBaseProps(partners.length);

  let outermostStem = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(outermostStem, gps, bps);
  expect(outermostStem.xBottomCenter).toBeCloseTo(0, 3);
  expect(outermostStem.yBottomCenter).toBeCloseTo(0, 3);
  expect(outermostStem.angle).toBeCloseTo((-Math.PI / 2) + (-Math.PI / 7), 3);
});

it('RoundLoop setCoordinatesAndAngles - sets properties of inner stems', () => {
  let partners = [null, 4, null, 2, null, 8, null, 6];
  let gps = new StrictLayoutGeneralProps();
  gps.rotation = Math.PI / 6;
  gps.basePairBondLength = 1.55;
  gps.terminiGap = 2;
  let bps = defaultBaseProps(partners.length);
  bps[0].stretch3 = 1.5;
  bps[4].stretch3 = 9;

  let omst1 = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst1, gps, bps);

  let omst2 = new Stem(0, partners, gps, bps);
  omst2.xBottomCenter = omst1.xBottomCenter;
  omst2.yBottomCenter = omst1.yBottomCenter;
  omst2.angle = omst1.angle;
  RoundLoop.setInnerCoordinatesAndAngles(omst2, gps, bps);

  let omit1 = omst1.loopIterator();
  let omit2 = omst2.loopIterator();

  for (let i = 0; i < 2; i++) {
    omit1.next();
    let st1 = omit1.next().value;
    omit2.next();
    let st2 = omit2.next().value;
    expect(st1.xBottomCenter).toBeCloseTo(st2.xBottomCenter, 3);
    expect(st1.yBottomCenter).toBeCloseTo(st2.yBottomCenter, 3);
    expect(st1.angle).toBeCloseTo(st2.angle, 3);
  }
});

it('RoundLoop setInnerCoordinatesAndAngles - zero inner stems', () => {
  let partners = [null, null, null];
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);

  let outermostStem = new Stem(0, partners, gps, bps);
  outermostStem.xBottomCenter = 0;
  outermostStem.yBottomCenter = 0;
  outermostStem.angle = Math.PI / 3;
  expect(
    () => RoundLoop.setInnerCoordinatesAndAngles(outermostStem, gps, bps)
  ).not.toThrow();
});

it('RoundLoop setInnerCoordinatesAndAngles - one inner stem', () => {
  let partners = [null, 7, 6, null, null, 3, 2, null, null];
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 2;
  gps.basePairBondLength = 0.8;
  let bps = defaultBaseProps(partners.length);
  bps[6].stretch3 = 2;
  bps[7].stretch3 = 2;
  bps[8].stretch3 = 2;

  let outermostStem = new Stem(0, partners, gps, bps);
  outermostStem.xBottomCenter = 1.2;
  outermostStem.yBottomCenter = 0.5;
  outermostStem.angle = 2 * Math.PI / 3;
  RoundLoop.setInnerCoordinatesAndAngles(outermostStem, gps, bps);

  let it = outermostStem.loopIterator();
  it.next();
  let st = it.next().value;
  expect(st.xBottomCenter).toBeCloseTo(1.442663503481902, 3);
  expect(st.yBottomCenter).toBeCloseTo(4.016626161970667, 3);
  expect(st.angle).toBeCloseTo(0.5008336114418507, 3);
});

it('RoundLoop setInnerCoordinatesAndAngles - multiple inner stems', () => {
  let partners = [6, 5, null, null, 2, 1, null, null, 14, 13, null, null, 10, 9];
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 1;
  gps.basePairBondLength = 0.9;
  let bps = defaultBaseProps(partners.length);
  bps[5].stretch3 = 1;
  bps[6].stretch3 = 1;
  bps[7].stretch3 = 1;

  let outermostStem = new Stem(0, partners, gps, bps);
  outermostStem.xBottomCenter = 1.2;
  outermostStem.yBottomCenter = 0;
  outermostStem.angle = -Math.PI / 8;
  RoundLoop.setInnerCoordinatesAndAngles(outermostStem, gps, bps);
  
  let it = outermostStem.loopIterator();
  it.next();
  let st1 = it.next().value;
  expect(st1.xBottomCenter).toBeCloseTo(2.3506926083092474, 3);
  expect(st1.yBottomCenter).toBeCloseTo(-2.166633719881043, 3);
  expect(st1.angle).toBeCloseTo(3.7872165675690517, 3);

  it.next();
  let st2 = it.next().value;
  expect(st2.xBottomCenter).toBeCloseTo(3.545703942072025, 3);
  expect(st2.yBottomCenter).toBeCloseTo(0.7183788492786163, 3);
  expect(st2.angle).toBeCloseTo(7.993755883392673, 3);
});

it('RoundLoop setInnerCoordinatesAndAngles - inner stems have inner stems (round loop)', () => {
  let partners = [9, 4, null, 2, null, 8, null, 6, 1];
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1.8;
  let bps = defaultBaseProps(partners.length);
  bps[0].loopShape = 'round';
  bps[3].stretch3 = 2.3;

  let omst1 = new Stem(0, partners, gps, bps);
  omst1.xBottomCenter = 0;
  omst1.yBottomCenter = 0;
  omst1.angle = -Math.PI / 8;
  RoundLoop.setInnerCoordinatesAndAngles(omst1, gps, bps);
  
  let omit1 = omst1.loopIterator();
  omit1.next();
  let ost1 = omit1.next().value;
  expect(ost1.hasRoundLoop()).toBeTruthy();

  let omst2 = new Stem(0, partners, gps, bps);
  let omit2 = omst2.loopIterator();
  omit2.next();
  let ost2 = omit2.next().value;

  ost2.xBottomCenter = ost1.xBottomCenter;
  ost2.yBottomCenter = ost1.yBottomCenter;
  ost2.angle = ost1.angle;
  StemLayout.setInnerCoordinatesAndAngles(ost2, gps, bps);

  let oit1 = ost1.loopIterator();
  let oit2 = ost2.loopIterator();

  for (let i = 0; i < 2; i++) {
    oit1.next();
    let st1 = oit1.next().value;
    oit2.next();
    let st2 = oit2.next().value;
    expect(st1.xBottomCenter).toBeCloseTo(st2.xBottomCenter, 3);
    expect(st1.yBottomCenter).toBeCloseTo(st2.yBottomCenter, 3);
    expect(st1.angle).toBeCloseTo(st2.angle, 3);
  }
});

it('RoundLoop setInnerCoordinatesAndAngles - inner stems have inner stems (triangle loop)', () => {
  let partners = [9, 4, null, 2, null, 8, null, 6, 1];
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1.8;
  let bps = defaultBaseProps(partners.length);
  bps[0].loopShape = 'triangle';
  bps[3].stretch3 = 7.8;

  let omst1 = new Stem(0, partners, gps, bps);
  omst1.xBottomCenter = 0;
  omst1.yBottomCenter = 0;
  omst1.angle = -Math.PI / 3;
  RoundLoop.setInnerCoordinatesAndAngles(omst1, gps, bps);
  
  let omit1 = omst1.loopIterator();
  omit1.next();
  let ost1 = omit1.next().value;
  expect(ost1.hasTriangleLoop()).toBeTruthy();

  let omst2 = new Stem(0, partners, gps, bps);
  let omit2 = omst2.loopIterator();
  omit2.next();
  let ost2 = omit2.next().value;

  ost2.xBottomCenter = ost1.xBottomCenter;
  ost2.yBottomCenter = ost1.yBottomCenter;
  ost2.angle = ost1.angle;
  StemLayout.setInnerCoordinatesAndAngles(ost2, gps, bps);

  let oit1 = ost1.loopIterator();
  let oit2 = ost2.loopIterator();

  for (let i = 0; i < 2; i++) {
    oit1.next();
    let st1 = oit1.next().value;
    oit2.next();
    let st2 = oit2.next().value;
    expect(st1.xBottomCenter).toBeCloseTo(st2.xBottomCenter, 3);
    expect(st1.yBottomCenter).toBeCloseTo(st2.yBottomCenter, 3);
    expect(st1.angle).toBeCloseTo(st2.angle, 3);
  }
});

it('RoundLoop setInnerCoordinatesAndAngles - given stem is not the outermost stem', () => {
  let partners = [16, 7, 6, null, null, 3, 2, null, null, 15, 14, null, null, 13, 12, 1];
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1;
  let bps = defaultBaseProps(partners.length);
  bps[0].stretch3 = 1;
  bps[14].stretch3 = 1.5;

  let st = new Stem(1, partners, gps, bps);
  st.xBottomCenter = 3.5;
  st.yBottomCenter = -4.5;
  st.angle = 2 * Math.PI / 3;
  RoundLoop.setInnerCoordinatesAndAngles(st, gps, bps);

  let it = st.loopIterator();
  it.next();
  let ist1 = it.next().value;
  expect(ist1.xBottomCenter).toBeCloseTo(3.298887217047535, 3);
  expect(ist1.yBottomCenter).toBeCloseTo(-1.0768310285201184, 3);
  expect(ist1.angle).toBeCloseTo(0.8144869842640198, 3);

  it.next();
  let ist2 = it.next().value;
  expect(ist2.xBottomCenter).toBeCloseTo(0.5927465485065604, 3);
  expect(ist2.yBottomCenter).toBeCloseTo(-2.2441461679881654, 3);
  expect(ist2.angle).toBeCloseTo(3.1415926535897922, 3);
});

it('TriangleLoop platformLength - a hairpin', () => {
  let partners = [6, 5, null, null, 2, 1];
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  let st = new Stem(1, partners, gps, bps);
  expect(TriangleLoop.platformLength(st)).toBe(0);
});

it('TriangleLoop platformLength - multiple branches', () => {
  let partners = [12, 11, null, 6, null, 4, 9, null, 7, null, 2, 1];
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 0.9;
  let bps = defaultBaseProps(partners.length);
  bps[5].stretch3 = 5.5;
  let st = new Stem(1, partners, gps, bps);
  expect(TriangleLoop.platformLength(st)).toBeCloseTo(11.3, 3);
});

it('TriangleLoop height - a hairpin', () => {});

it('TriangleLoop height - one branch', () => {});

it('TriangleLoop height - multiple branches', () => {});

it("TriangleLoop _heightOneBranch - 5' side is greater", () => {});

it("TriangleLoop _heightOneBranch - 3' side is greater", () => {});

it("TriangleLoop _heightMultipleBranches - 5' side is greater", () => {});

it("TriangleLoop _heightMultipleBranches - 3' side is greater", () => {});

it("TriangleLoop _heightMultipleBranches - platform length is too large for either side", () => {});

it('TriangleLoop _heightMultipleBranches - uses maxTriangleLoopAngle general property', () => {});

it('TriangleLoop setInnerCoordinatesAndAngles - a hairpin', () => {});

it('TriangleLoop setInnerCoordinatesAndAngles - one branch', () => {});

it('TriangleLoop setInnerCoordinatesAndAngles - multiple branches', () => {});

it('FlatOutermostLoop traverseUnpairedRegion53 - size of zero', () => {
  let partners = [3, null, 1, null];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  let bps = defaultBaseProps(partners.length);

  let outermostStem = new Stem(0, partners, gps, bps);
  let it = outermostStem.loopIterator();
  let ur = it.next().value;
  let st3 = it.next().value;
  
  st3.angle = -Math.PI / 2;
  st3.xBottomCenter = 0;
  st3.yBottomCenter = 0;

  expect(
    FlatOutermostLoop.traverseUnpairedRegion53(ur, bps).length
  ).toBe(0);
});

it('FlatoutermostLoop traverseUnpairedRegion53 - size of one', () => {
  let partners = [null, 4, null, 2, null];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  let bps = defaultBaseProps(partners.length);
  bps[3].stretch3 = 2.2;
  bps[3].flatOutermostLoopAngle3 = Math.PI / 7;

  let outermostStem = new Stem(0, partners, gps, bps);
  let it = outermostStem.loopIterator();
  it.next();
  let st5 = it.next().value;
  let ur = it.next().value;

  st5.angle = Math.PI / 3;
  st5.xBottomCenter = 1.2;
  st5.yBottomCenter = 3.77;
  
  checkCoords(
    FlatOutermostLoop.traverseUnpairedRegion53(ur, bps),
    [
      [-3.1936791509797766, 4.492148299476559],
    ],
  );
});

it('FlatOutermostLoop traverseUnpairedRegion53 - size of four', () => {
  let partners = [null, 4, null, 2, null, null, null, null];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  let bps = defaultBaseProps(partners.length);
  bps[3].stretch3 = 2;
  bps[3].flatOutermostLoopAngle3 = Math.PI / 8;
  bps[4].stretch3 = -5;
  bps[4].flatOutermostLoopAngle3 = 0;
  bps[5].stretch3 = 5;
  bps[5].flatOutermostLoopAngle3 = -Math.PI / 8;

  let outermostStem = new Stem(0, partners, gps, bps);
  let it = outermostStem.loopIterator();
  it.next();
  let st5 = it.next().value;
  let ur = it.next().value;

  st5.angle = -Math.PI / 3;
  st5.xBottomCenter = 1;
  st5.yBottomCenter = 1.4;

  checkCoords(
    FlatOutermostLoop.traverseUnpairedRegion53(ur, bps),
    [
      [3.528912231189045, 3.3970473189814863],
      [4.137673660197765, 4.190400659272721],
      [9.333826082904398, 7.190400659272721],
      [10.199851486688837, 7.690400659272721],
    ],
  );
});

it("FlatOutermost traverseUnpairedRegion53 - 5' dangling unpaired region", () => {
  let partners = [null, null, null, 6, null, 4, null];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  let bps = defaultBaseProps(partners.length);
  bps[0].stretch3 = 2;
  bps[0].flatOutermostLoopAngle3 = Math.PI / 3;
  bps[1].stretch3 = 10;
  bps[1].flatOutermostLoopAngle3 = -Math.PI / 2;
  
  let outermostStem = new Stem(0, partners, gps, bps);
  let it = outermostStem.loopIterator();
  let ur = it.next().value;
  
  outermostStem.angle = (Math.PI / 6) - (Math.PI / 2);
  outermostStem.xBottomCenter = -1;
  outermostStem.yBottomCenter = -5;

  checkCoords(
    FlatOutermostLoop.traverseUnpairedRegion53(ur, bps),
    [
      [-1.6830127018922192, -6.18301270189222],
      [-1.6830127018922183, -3.1830127018922196],
      [9.316987298107781, -3.1830127018922223],
    ],
  );
});

it('FlatOutermostLoop setNextCoordinatesAndAngle53 - size of zero', () => {
  let partners = [3, null, 1, 6, null, 4];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  gps.basePairBondLength = 2.3;
  let bps = defaultBaseProps(partners.length);
  bps[2].stretch3 = 2.6;
  bps[2].flatOutermostLoopAngle3 = Math.PI / 7;

  let outermostStem = new Stem(0, partners, gps, bps);
  let it = outermostStem.loopIterator();
  it.next();
  let st5 = it.next().value;
  let ur = it.next().value;
  let st3 = it.next().value;

  st5.angle = Math.PI / 3;
  st5.xBottomCenter = 2.2;
  st5.yBottomCenter = 3.2;

  FlatOutermostLoop.setNextCoordinatesAndAngle53(ur, bps);
  expect(st3.angle).toBeCloseTo((Math.PI / 3) + (Math.PI / 7), 3);
  let bc5 = st3.baseCoordinates5();
  expect(bc5.xCenter).toBeCloseTo(-2.5688756698522486, 3);
  expect(bc5.yCenter).toBeCloseTo(4.727040336911129, 3);
});

it('FlatOutermostLoop setNextCoordinatesAndAngle53 - size of one', () => {
  let partners = [3, null, 1, null, 7, null, 5];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  gps.basePairBondLength = 0.77;
  let bps = defaultBaseProps(partners.length);
  bps[2].stretch3 = 0.5;
  bps[2].flatOutermostLoopAngle3 = Math.PI / 3;
  bps[3].stretch3 = 10;
  bps[3].flatOutermostLoopAngle3 = -Math.PI / 6;

  let outermostStem = new Stem(0, partners, gps, bps);
  let it = outermostStem.loopIterator();
  it.next();
  let st5 = it.next().value;
  let ur = it.next().value;
  let st3 = it.next().value;

  st5.angle = -Math.PI / 5;
  st5.xBottomCenter = -2.1;
  st5.yBottomCenter = 2.44;
  
  FlatOutermostLoop.setNextCoordinatesAndAngle53(ur, bps);
  expect(st3.angle).toBeCloseTo((-Math.PI / 5) + (Math.PI / 6), 3);
  let bc5 = st3.baseCoordinates5();
  expect(bc5.xCenter).toBeCloseTo(-0.6355929040558095, 3);
  expect(bc5.yCenter).toBeCloseTo(15.172145849051006, 3);
});

it('FlatOutermostLoop setNextCoordinatesAndAngle53 - size of four', () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  gps.basePairBondLength = 3.5;
  let bps = defaultBaseProps(partners.length);
  bps[4].stretch3 = 2.2;
  bps[5].flatOutermostLoopAngle3 = 5 * Math.PI / 3;
  bps[6].stretch3 = 5.4;
  bps[6].flatOutermostLoopAngle3 = -Math.PI / 3;

  let outermostStem = new Stem(0, partners, gps, bps);
  let it = outermostStem.loopIterator();
  it.next();
  let st5 = it.next().value;
  let ur = it.next().value;
  let st3 = it.next().value;

  st5.angle = -4 * Math.PI / 9;
  st5.xBottomCenter = 1.33;
  st5.yBottomCenter = -5.4;

  FlatOutermostLoop.setNextCoordinatesAndAngle53(ur, bps);
  expect(normalizeAngle(st3.angle, 0)).toBeCloseTo(2.7925268031909276, 3);
  let bc5 = st3.baseCoordinates5();
  expect(bc5.xCenter).toBeCloseTo(7.20750008271572, 3);
  expect(bc5.yCenter).toBeCloseTo(-11.378801773029814, 3);
});

it("FlatOutermostLoop setNextCoordinatesAndAngle53 - 5' dangling unpaired region", () => {
  let partners = [null, 4, null, 2];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  let bps = defaultBaseProps(partners.length);
  bps[0].stretch3 = 2.4;
  bps[0].flatOutermostLoopAngle3 = Math.PI / 6;

  let outermostStem = new Stem(0, partners, gps, bps);
  let it = outermostStem.loopIterator();
  let ur = it.next().value;
  let st3 = it.next().value;

  outermostStem.angle = -Math.PI / 2;
  outermostStem.xBottomCenter = 0;
  outermostStem.yBottomCenter = 0;

  FlatOutermostLoop.setNextCoordinatesAndAngle53(ur, bps);
  expect(st3.angle).toBeCloseTo((Math.PI / 6) - (Math.PI / 2), 3);
  let bc5 = st3.baseCoordinates5();
  expect(bc5.xCenter).toBeCloseTo(2.4444863728670914, 3);
  expect(bc5.yCenter).toBeCloseTo(1.1999999999999997, 3);
});

it("FlatOutermostLoop setNextCoordinatesAndAngle53 - negative 3' stretch", () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  gps.basePairBondLength = 3.5;
  let bps = defaultBaseProps(partners.length);
  bps[4].stretch3 = 2.2;
  bps[5].flatOutermostLoopAngle3 = 5 * Math.PI / 3;
  bps[6].stretch3 = -8.8;
  bps[6].flatOutermostLoopAngle3 = -Math.PI / 5;

  let outermostStem = new Stem(0, partners, gps, bps);
  let it = outermostStem.loopIterator();
  it.next();
  let st5 = it.next().value;
  let ur = it.next().value;
  let st3 = it.next().value;

  st5.angle = -4 * Math.PI / 9;
  st5.xBottomCenter = 1.33;
  st5.yBottomCenter = -5.4;

  FlatOutermostLoop.setNextCoordinatesAndAngle53(ur, bps);
  expect(normalizeAngle(st3.angle, 0)).toBeCloseTo(3.2114058236695664, 3);
  let bc5 = st3.baseCoordinates5();
  expect(bc5.xCenter).toBeCloseTo(9.466185473744124, 3);
  expect(bc5.yCenter).toBeCloseTo(-6.362333050259824, 3);
});

it('FlatOutermostLoop setCoordinatesAndAngles - sets outermost stem properties', () => {
  let partners = [null, 4, null, 2, null];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  let bps = defaultBaseProps(partners.length);

  let outermostStem = new Stem(0, partners, gps, bps);
  FlatOutermostLoop.setCoordinatesAndAngles(outermostStem, gps, bps);
  expect(outermostStem.xBottomCenter).toBeCloseTo(0, 3);
  expect(outermostStem.yBottomCenter).toBeCloseTo(0, 3);
  expect(outermostStem.angle).toBeCloseTo(-Math.PI / 2, 3);
});

it('FlatOutermostLoop setCoordinatesAndAngles - uses rotation general property', () => {
  let partners = [null, 4, null, 2, null];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  gps.rotation = Math.PI / 3;
  let bps = defaultBaseProps(partners.length);

  let outermostStem = new Stem(0, partners, gps, bps);
  FlatOutermostLoop.setCoordinatesAndAngles(outermostStem, gps, bps);
  expect(outermostStem.xBottomCenter).toBeCloseTo(0, 3);
  expect(outermostStem.yBottomCenter).toBeCloseTo(0, 3);
  expect(outermostStem.angle).toBeCloseTo((-Math.PI / 2) + (Math.PI / 3), 3);
});

it('FlatOutermostLoop setCoordinatesAndAngles - sequence of length zero', () => {
  let partners = [];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  gps.rotation = Math.PI / 3;
  let bps = [];

  let outermostStem = new Stem(0, partners, gps, bps);
  FlatOutermostLoop.setCoordinatesAndAngles(outermostStem, gps, bps);
  expect(outermostStem.xBottomCenter).toBeCloseTo(0, 3);
  expect(outermostStem.yBottomCenter).toBeCloseTo(0, 3);
  expect(outermostStem.angle).toBeCloseTo((-Math.PI / 2) + (Math.PI / 3), 3);
});

it('FlatOutermostLoop setCoordinatesAndAngles - zero stems', () => {
  let partners = [null, null, null];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  gps.rotation = -Math.PI / 6;
  let bps = defaultBaseProps(partners.length);

  let outermostStem = new Stem(0, partners, gps, bps);
  FlatOutermostLoop.setCoordinatesAndAngles(outermostStem, gps, bps);
  expect(outermostStem.xBottomCenter).toBeCloseTo(0, 3);
  expect(outermostStem.yBottomCenter).toBeCloseTo(0, 3);
  expect(outermostStem.angle).toBeCloseTo((-Math.PI / 2) + (-Math.PI / 6), 3);
});

it('FlatOutermostLoop setCoordinatesAndAngles - one stem', () => {
  let partners = [null, 4, null, 2, null];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  gps.basePairBondLength = 1.5;
  gps.rotation = -Math.PI / 6;
  let bps = defaultBaseProps(partners.length);
  bps[0].stretch3 = 6.5;
  bps[0].flatOutermostLoopAngle3 = Math.PI / 3;

  let omst1 = new Stem(0, partners, gps, bps);
  let it1 = omst1.loopIterator();
  it1.next();
  let st1 = it1.next().value;

  let omst2 = new Stem(0, partners, gps, bps);
  let it2 = omst2.loopIterator();
  let ur2 = it2.next().value;
  let st2 = it2.next().value;

  FlatOutermostLoop.setCoordinatesAndAngles(omst1, gps, bps);
  expect(omst1.xBottomCenter).toBeCloseTo(0, 3);
  expect(omst1.yBottomCenter).toBeCloseTo(0, 3);
  expect(omst1.angle).toBeCloseTo((-Math.PI / 6) - (Math.PI / 2), 3);

  omst2.xBottomCenter = omst1.xBottomCenter;
  omst2.yBottomCenter = omst1.yBottomCenter;
  omst2.angle = omst1.angle;
  FlatOutermostLoop.setNextCoordinatesAndAngle53(ur2, bps);
  expect(st1.xBottomCenter).toBeCloseTo(st2.xBottomCenter, 3);
  expect(st1.yBottomCenter).toBeCloseTo(st2.yBottomCenter, 3);
  expect(st1.angle).toBeCloseTo(st2.angle, 3);
});

it('FlatOutermostLoop setCoordinatesAndAngles - multiple stems', () => {
  let partners = [3, null, 1, null, 7, null, 5, 10, null, 8, null];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  gps.basePairBondLength = 1.8;
  gps.rotation = 4 * Math.PI / 9;
  let bps = defaultBaseProps(partners.length);
  bps[3].stretch3 = 7.8;
  bps[3].flatOutermostLoopAngle3 = Math.PI / 6;
  bps[6].stretch3 = -10.1;
  bps[6].flatOutermostLoopAngle3 = -Math.PI / 3;

  let omst1 = new Stem(0, partners, gps, bps);
  FlatOutermostLoop.setCoordinatesAndAngles(omst1, gps, bps);
  expect(omst1.xBottomCenter).toBeCloseTo(0, 3);
  expect(omst1.yBottomCenter).toBeCloseTo(0, 3);
  expect(omst1.angle).toBeCloseTo((-Math.PI / 2) + (4 * Math.PI / 9), 3);

  let omst2 = new Stem(0, partners, gps, bps);
  omst2.xBottomCenter = omst1.xBottomCenter;
  omst2.yBottomCenter = omst1.yBottomCenter;
  omst2.angle = omst1.angle;

  let it1 = omst1.loopIterator();
  let it2 = omst2.loopIterator();
  
  for (let i = 0; i < 3; i++) {
    let ur2 = it2.next().value;
    FlatOutermostLoop.setNextCoordinatesAndAngle53(ur2, bps);
    
    it1.next();
    let st1 = it1.next().value;
    let st2 = it2.next().value;
    expect(st1.xBottomCenter).toBeCloseTo(st2.xBottomCenter, 3);
    expect(st1.yBottomCenter).toBeCloseTo(st2.yBottomCenter, 3);
    expect(st1.angle).toBeCloseTo(st2.angle, 3);
  }
});

it('FlatOutermostLoop setCoordinatesAndAngles - sets properties of inner stems (round loop)', () => {
  let partners = [9, 4, null, 2, null, 8, null, 6, 1];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  gps.basePairBondLength = 1.8;
  let bps = defaultBaseProps(partners.length);
  bps[0].loopShape = 'round';
  bps[3].stretch3 = 5.5;

  let omst1 = new Stem(0, partners, gps, bps);
  FlatOutermostLoop.setCoordinatesAndAngles(omst1, gps, bps);
  
  let omit1 = omst1.loopIterator();
  omit1.next();
  let ost1 = omit1.next().value;
  expect(ost1.hasRoundLoop()).toBeTruthy();

  let omst2 = new Stem(0, partners, gps, bps);
  let omit2 = omst2.loopIterator();
  omit2.next();
  let ost2 = omit2.next().value;

  ost2.xBottomCenter = ost1.xBottomCenter;
  ost2.yBottomCenter = ost1.yBottomCenter;
  ost2.angle = ost1.angle;
  StemLayout.setInnerCoordinatesAndAngles(ost2, gps, bps);

  let oit1 = ost1.loopIterator();
  let oit2 = ost2.loopIterator();

  for (let i = 0; i < 2; i++) {
    oit1.next();
    let st1 = oit1.next().value;
    oit2.next();
    let st2 = oit2.next().value;
    expect(st1.xBottomCenter).toBeCloseTo(st2.xBottomCenter, 3);
    expect(st1.yBottomCenter).toBeCloseTo(st2.yBottomCenter, 3);
    expect(st1.angle).toBeCloseTo(st2.angle, 3);
  }
});

it('FlatOutermostLoop setCoordinatesAndAngles - sets properties of inner stems (triangle loop)', () => {
  let partners = [9, 4, null, 2, null, 8, null, 6, 1];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  gps.basePairBondLength = 1.8;
  let bps = defaultBaseProps(partners.length);
  bps[0].loopShape = 'triangle';
  bps[3].stretch3 = 15.5;

  let omst1 = new Stem(0, partners, gps, bps);
  FlatOutermostLoop.setCoordinatesAndAngles(omst1, gps, bps);
  
  let omit1 = omst1.loopIterator();
  omit1.next();
  let ost1 = omit1.next().value;
  expect(ost1.hasTriangleLoop()).toBeTruthy();

  let omst2 = new Stem(0, partners, gps, bps);
  let omit2 = omst2.loopIterator();
  omit2.next();
  let ost2 = omit2.next().value;

  ost2.xBottomCenter = ost1.xBottomCenter;
  ost2.yBottomCenter = ost1.yBottomCenter;
  ost2.angle = ost1.angle;
  StemLayout.setInnerCoordinatesAndAngles(ost2, gps, bps);

  let oit1 = ost1.loopIterator();
  let oit2 = ost2.loopIterator();

  for (let i = 0; i < 2; i++) {
    oit1.next();
    let st1 = oit1.next().value;
    oit2.next();
    let st2 = oit2.next().value;
    expect(st1.xBottomCenter).toBeCloseTo(st2.xBottomCenter, 3);
    expect(st1.yBottomCenter).toBeCloseTo(st2.yBottomCenter, 3);
    expect(st1.angle).toBeCloseTo(st2.angle, 3);
  }
});
