import {
  baseCoordinatesRound,
  _coordinatesBounding5,
  _coordinatesBounding3,
  _polarLengthToFit,
  _center,
  _radius,
  _angleBounding5,
  _angleBounding3,
  _angleSpanBetweenBounds,
  _polarLengthBetweenBounds,
  _startingAngle,
  _angleIncrement,
} from './UnpairedRegionRound';
import StrictLayoutGeneralProps from './StrictLayoutGeneralProps';
import StrictLayoutBaseProps from './StrictLayoutBaseProps';
import Stem from './Stem';
import parseDotBracket from '../../../../parse/parseDotBracket';
import { RoundLoop } from './StemLayout';
import normalizeAngle from '../../../normalizeAngle';

function defaultBaseProps(length) {
  let bps = [];
  for (let i = 0; i < length; i++) {
    bps.push(new StrictLayoutBaseProps());
  }
  return bps;
}

it('_coordinatesBounding5 - boundingStem5 is the outermost stem', () => {
  let partners = parseDotBracket('..(((....)))..').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.rotation = Math.PI / 3;
  gps.terminiGap = 1.5;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  let ur = it.next().value;
  let cb5 = _coordinatesBounding5(ur, gps);
  expect(cb5.x).toBeCloseTo(-0.0006412282186380958, 3);
  expect(cb5.y).toBeCloseTo(-1.433619000151573, 3);
});

it('_coordinatesBounding5 - boundingStem5 is not the outermost stem', () => {
  let partners = parseDotBracket('(((...((((....))))..(((...))).)))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let omit = omst.loopIterator();
  omit.next();
  let st = omit.next().value;
  let stit = st.loopIterator();
  let ur = stit.next().value;
  let cb5 = _coordinatesBounding5(ur, gps);
  expect(cb5.x).toBeCloseTo(2.5488715261690347, 3);
  expect(cb5.y).toBeCloseTo(-1.1000000000000008, 3);
});

it('_coordinatesBounding3 - boundingStem3 is the outermost stem', () => {
  let partners = parseDotBracket('.(((.....)))..').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 15;
  gps.rotation = Math.PI / 6;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;
  let cb3 = _coordinatesBounding3(ur, gps);
  expect(cb3.x).toBeCloseTo(0.4186567146356723, 3);
  expect(cb3.y).toBeCloseTo(3.3545540909828073, 3);
});

it('_coordinatesBounding3 - boundingStem3 is not the outermost stem', () => {
  let partners = parseDotBracket('(((...((((.....)))).......)))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let omit = omst.loopIterator();
  omit.next();
  let st = omit.next().value;
  let stit = st.loopIterator();
  stit.next();
  stit.next();
  let ur = stit.next().value;
  let cb3 = _coordinatesBounding3(ur, gps);
  expect(cb3.x).toBeCloseTo(2.5488715261690356, 3);
  expect(cb3.y).toBeCloseTo(1.0999999999999994, 3);
});

it('_polarLengthToFit - both bounding stems are the outermost stem', () => {
  let partners = parseDotBracket('....').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  let ur = it.next().value;
  expect(_polarLengthToFit(ur)).toBe(4);
});

it('_polarLengthToFit - only boundingStem5 is the outermost stem', () => {
  let partners = parseDotBracket('..(((...))).').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  let ur = it.next().value;
  expect(_polarLengthToFit(ur)).toBe(2.5);
});

it('_polarLengthToFit - only boundingStem3 is the outermost stem', () => {
  let partners = parseDotBracket('..(((...))).').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;
  expect(_polarLengthToFit(ur)).toBe(1.5);
});

it('_polarLengthToFit - neither bounding stem is the outermost stem', () => {
  let partners = parseDotBracket('..(((.....))).').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  let omit = omst.loopIterator();
  omit.next();
  let st = omit.next().value;
  let stit = st.loopIterator();
  let ur = stit.next().value;
  expect(_polarLengthToFit(ur)).toBe(6);
});

it('_center - both bounding stems are the outermost stem and the termini gap is very small', () => {
  let partners = parseDotBracket('......').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 0;
  gps.rotation = Math.PI / 3;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  let ur = it.next().value;
  let center = _center(ur, gps);
  expect(center.x).toBeCloseTo(0, 3);
  expect(center.y).toBeCloseTo(0, 3);
});

it('_center - else case', () => {
  let partners = parseDotBracket('..(((....))).....').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 1.5;
  gps.rotation = -2 * Math.PI / 3;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  let ur = it.next().value;
  let center = _center(ur, gps);
  expect(center.x).toBeCloseTo(0, 3);
  expect(center.y).toBeCloseTo(0, 3);
});

it('_radius', () => {
  let partners = parseDotBracket('..(((....)))..').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 2;
  gps.basePairBondLength = (2 * (7 / Math.PI)) - 1;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  let ur = it.next().value;
  expect(_radius(ur, gps)).toBeCloseTo(7 / Math.PI, 2);
});

it('_angleBounding5', () => {
  let partners = parseDotBracket('..((((.....))))....').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 1;
  gps.basePairBondLength = 1.2;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;
  expect(normalizeAngle(_angleBounding5(ur, gps))).toBeCloseTo(0.12259607673582126, 3);
});

it('_angleBounding3', () => {
  let partners = parseDotBracket('..((((.....))))....').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 1;
  gps.basePairBondLength = 1.2;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;
  expect(normalizeAngle(_angleBounding3(ur, gps))).toBeCloseTo(2.839692995904396, 3);
});

it('_angleSpanBetweenBounds - both stems are outermost and very small termini gap', () => {
  let partners = parseDotBracket('...').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 0;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  let ur = it.next().value;
  expect(_angleSpanBetweenBounds(ur, gps)).toBeCloseTo(2 * Math.PI, 3);
});

it('_angleSpanBetweenBounds - else case', () => {
  let partners = parseDotBracket('(((....)))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1.5;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let omit = omst.loopIterator();
  omit.next();
  let st = omit.next().value;
  let stit = st.loopIterator();
  let ur = stit.next().value;
  expect(_angleSpanBetweenBounds(ur, gps)).toBeCloseTo(3.7909885340679628, 3);
});

it('_polarLengthBetweenBounds', () => {
  let partners = parseDotBracket('..(((....))).....(((....))).').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 3;
  gps.basePairBondLength = 2;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;
  expect(_polarLengthBetweenBounds(ur, gps)).toBeCloseTo(6, 3);
});

it('_startingAngle - unpaired region of size zero', () => {
  let partners = [];
  let gps = new StrictLayoutGeneralProps();
  let bps = [];
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  let ur = it.next().value;
  expect(_startingAngle(ur, gps)).toBe(0);
});

it('_startingAngle - boundingStem5 is the outermost stem', () => {
  let partners = parseDotBracket('.....').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.rotation = Math.PI / 3;
  gps.terminiGap = 0;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  let ur = it.next().value;
  expect(normalizeAngle(_startingAngle(ur, gps))).toBeCloseTo(4.817108735504348, 3);
});

it('_startingAngle - size is greater than zero and boundingStem5 is not the outermost stem', () => {
  let partners = parseDotBracket('..(((....)))...').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 3;
  gps.rotation = Math.PI / 6;
  gps.basePairBondLength = 0.9;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;
  expect(normalizeAngle(_startingAngle(ur, gps))).toBeCloseTo(1.382085151612082, 3);
});

it('_angleIncrement - unpaired region of size zero', () => {
  let partners = [];
  let gps = new StrictLayoutGeneralProps();
  let bps = [];
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  let ur = it.next().value;
  expect(_angleIncrement(ur, gps)).toBe(0);
});

it('_angleIncrement - boundingStem5 is the outermost stem and some positive stretch', () => {
  let partners = parseDotBracket('...(((....))).').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 0;
  gps.basePairBondLength = 1.2;
  let bps = defaultBaseProps(partners.length);
  bps[0].stretch3 = 2;
  bps[1].stretch3 = 2;
  bps[2].stretch3 = 2;
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  let ur = it.next().value;
  expect(_angleIncrement(ur, gps)).toBeCloseTo(0.3207913849843259, 3);
});

it('_angleIncrement - boundingStem5 is not the outermost stem and some negative stretch', () => {
  let partners = parseDotBracket('(((...)))...(((...)))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 1;
  gps.basePairBondLength = 1;
  let bps = defaultBaseProps(partners.length);
  bps[9].stretch3 = -0.25;
  bps[10].stretch3 = -0.25;
  bps[11].stretch3 = -0.25;
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;
  expect(_angleIncrement(ur, gps)).toBeCloseTo(0.7461625835116426, 3);
});

function checkCoords(coords, expectedCoords) {
  expect(coords.length).toBe(expectedCoords.length);
  for (let i = 0; i < expectedCoords.length; i++) {
    expect(coords[i].xCenter).toBeCloseTo(expectedCoords[i][0]);
    expect(coords[i].yCenter).toBeCloseTo(expectedCoords[i][1]);
  }
}

it('baseCoordinatesRound - unpaired region of size zero', () => {
  let partners = [];
  let gps = new StrictLayoutGeneralProps();
  let bps = [];
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  let ur = it.next().value;
  checkCoords(baseCoordinatesRound(ur, gps), []);
});

it('baseCoordinatesRound - a hairpin loop', () => {
  let partners = parseDotBracket('(((.....)))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 0;
  gps.basePairBondLength = 3;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let omit = omst.loopIterator();
  omit.next();
  let st = omit.next().value;
  let stit = st.loopIterator();
  let ur = stit.next().value;
  checkCoords(
    baseCoordinatesRound(ur, gps),
    [
      [54.55655850352339, -1.6846340230388055],
      [55.22962979497659, -0.9590793224318199],
      [55.47380481465533, -1.2878587085651816e-14],
      [55.22962979497659, 0.9590793224317941],
      [54.55655850352339, 1.68463402303878],
    ],
  );
});

it('baseCoordinatesRound - positive stretch', () => {
  let partners = parseDotBracket('(((....)))....').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 0;
  gps.basePairBondLength = 1;
  let bps = defaultBaseProps(partners.length);
  bps[9].stretch3 = 1;
  bps[10].stretch3 = 1;
  bps[11].stretch3 = 1;
  bps[12].stretch3 = 1;
  bps[13].stretch3 = 1;
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;
  checkCoords(
    baseCoordinatesRound(ur, gps),
    [
      [0.23284564697552712, -1.1578242151124867],
      [0.1635622093570437, -0.18713280565033374],
      [-0.5846909584166444, 0.435088380141742],
      [-1.5517377181879737, 0.3261729471323285],
    ],
  );
});

it('baseCoordinatesRound - negative stretch', () => {
  let partners = parseDotBracket('(((....)))....').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 0;
  gps.basePairBondLength = 1;
  let bps = defaultBaseProps(partners.length);
  bps[9].stretch3 = -0.25;
  bps[10].stretch3 = -0.25;
  bps[11].stretch3 = -0.25;
  bps[12].stretch3 = -0.25;
  bps[13].stretch3 = -0.25;
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;
  checkCoords(
    baseCoordinatesRound(ur, gps),
    [
      [1.0147663353469702, 0.957626638518049],
      [0.2554503373204767, 1.5574923270569692],
      [-0.6896437456474855, 1.3496539199128874],
      [-1.1272386618473995, 0.48657204751535393],
    ],
  );
});
