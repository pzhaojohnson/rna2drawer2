import { RoundLoop, TriangleLoop, FlatOutermostLoop, StemLayout } from './StemLayout';
import StrictLayoutGeneralProps from './StrictLayoutGeneralProps';
import StrictLayoutBaseProps from './StrictLayoutBaseProps';
import Stem from './Stem';
import normalizeAngle from '../../../normalizeAngle';

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

it('FlatOutermostLoop setCoordinatesAndAngles - uses rotation general property', () => {});

it('FlatOutermostLoop setCoordinatesAndAngles - sequence of length zero', () => {});

it('FlatOutermostLoop setCoordinatesAndAngles - zero stems', () => {});

it('FlatOutermostLoop setCoordinatesAndAngles - one stem', () => {});

it('FlatOutermostLoop setCoordinatesAndAngles - multiple stems', () => {});
