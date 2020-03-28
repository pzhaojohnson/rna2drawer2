import { RoundLoop, TriangleLoop, FlatOutermostLoop, StemLayout } from './StemLayout';
import StrictLayoutGeneralProps from './StrictLayoutGeneralProps';
import StrictLayoutBaseProps from './StrictLayoutBaseProps';
import Stem from './Stem';
import normalizeAngle from '../../../normalizeAngle';
import parseDotBracket from '../../../../parse/parseDotBracket';
import { circleCircumference } from './circleCircumference';
import { circleCenter } from './circleCenter';
import distanceBetween from '../../../distanceBetween';
import angleBetween from '../../../angleBetween';

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

it('RoundLoop circumference - an inner stem', () => {
  let partners = parseDotBracket('(((..(((....)))...(((....))))))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1.5;
  let bps = defaultBaseProps(partners.length);
  let st = new Stem(1, partners, gps, bps);
  expect(
    RoundLoop.circumference(st, gps)
  ).toBeCloseTo(circleCircumference(2.5, 3, 8), 3);
});

it('RoundLoop circumference - the outermost stem', () => {
  let partners = parseDotBracket('..(((.....)))....(((...)))..').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 5.6;
  gps.basePairBondLength = 0.8;
  let bps = defaultBaseProps(partners.length);
  let st = new Stem(0, partners, gps, bps);
  expect(
    RoundLoop.circumference(st, gps)
  ).toBeCloseTo(circleCircumference(1.8, 2, 15.6), 3);
});

it('RoundLoop radius', () => {
  let partners = parseDotBracket('(((..((((.....))))...)))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  let st = new Stem(1, partners, gps, bps);
  expect(
    RoundLoop.radius(st, gps)
  ).toBeCloseTo(RoundLoop.circumference(st, gps) / (2 * Math.PI), 3);
});

it('RoundLoop center - the outermost stem', () => {
  let partners = parseDotBracket('..((((.....)))).....').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  let st = new Stem(0, partners, gps, bps);
  let center = RoundLoop.center(st, gps);
  expect(center.x).toBe(0);
  expect(center.y).toBe(0);
});

it('RoundLoop center - an inner stem with zero branches', () => {
  let partners = parseDotBracket('(((....)))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1.5;
  let bps = defaultBaseProps(partners.length);
  let st = new Stem(1, partners, gps, bps);
  st.angle = 2 * Math.PI / 3;
  let center = RoundLoop.center(st, gps);
  let bct5 = st.baseCoordinatesTop5();
  let bct3 = st.baseCoordinatesTop3();
  let expectedCenter = circleCenter(bct5.xCenter, bct5.yCenter, bct3.xCenter, bct3.yCenter, 5);
  expect(center.x).toBeCloseTo(expectedCenter.x, 3);
  expect(center.y).toBeCloseTo(expectedCenter.y, 3);
});

it('RoundLoop center - an inner stem with multiple branches', () => {
  let partners = parseDotBracket('((...(((...))).....(((..))).))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  let st = new Stem(1, partners, gps, bps);
  st.angle = 5 * Math.PI / 3;
  let center = RoundLoop.center(st, gps);
  let expectedRadius = RoundLoop.radius(st, gps);
  let bct5 = st.baseCoordinatesTop5();
  let bct3 = st.baseCoordinatesTop3();
  expect(
    distanceBetween(center.x, center.y, bct5.xCenter, bct5.yCenter)
  ).toBeCloseTo(expectedRadius, 3);
  expect(
    distanceBetween(center.x, center.y, bct3.xCenter, bct3.yCenter)
  ).toBeCloseTo(expectedRadius, 3);
  let xMiddle = (bct5.xCenter + bct3.xCenter) / 2;
  let yMiddle = (bct5.yCenter + bct3.yCenter) / 2;
  expect(
    normalizeAngle(angleBetween(xMiddle, yMiddle, center.x, center.y))
  ).toBeCloseTo(normalizeAngle(st.angle), 3);
});

it('RoundLoop originAngle - an inner stem', () => {
  let partners = parseDotBracket('(((....)))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  let st = new Stem(1, partners, gps, bps);
  st.angle = Math.PI / 3;
  expect(
    normalizeAngle(RoundLoop.originAngle(st, gps))
  ).toBeCloseTo(4 * Math.PI / 3, 3);
});

it('RoundLoop originAngle - the outermost stem', () => {
  let partners = parseDotBracket('..(((....))).').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.rotation = -Math.PI / 6;
  let bps = defaultBaseProps(partners.length);
  let st = new Stem(0, partners, gps, bps);
  expect(
    normalizeAngle(RoundLoop.originAngle(st, gps))
  ).toBeCloseTo(5 * Math.PI / 6, 3);
});

it('RoundLoop polarLengthPerStem - an inner stem', () => {
  let partners = parseDotBracket('(((....)))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1;
  let bps = defaultBaseProps(partners.length);
  let st = new Stem(1, partners, gps, bps);
  expect(RoundLoop.polarLengthPerStem(st, gps)).toBeCloseTo(3.3907821334634507, 3);
});

it('RoundLoop polarLengthPerStem - the outermost stem with one inner stem', () => {
  let partners = parseDotBracket('.(((....)))..').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 4;
  gps.basePairBondLength = 1.5;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  expect(RoundLoop.polarLengthPerStem(omst, gps)).toBeCloseTo(3.7992885681490196, 3);
});

it('RoundLoop polarLengthPerStem - zero stems', () => {
  let partners = parseDotBracket('....').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  expect(RoundLoop.polarLengthPerStem(omst, gps)).toBe(0);
});

it('RoundLoop angleSpanPerStem', () => {
  let partners = parseDotBracket('.(((....)))..').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 4;
  gps.basePairBondLength = 1.5;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  expect(RoundLoop.angleSpanPerStem(omst, gps)).toBeCloseTo(2.2104821033799684, 3);
});

it('RoundLoop polarLengthBetweenTermini - no inner stems (and includes stretch)', () => {
  let partners = parseDotBracket('...').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 6;
  let bps = defaultBaseProps(partners.length);
  bps[0].stretch3 = 3;
  let omst = new Stem(0, partners, gps, bps);
  expect(RoundLoop.polarLengthBetweenTermini(omst, gps)).toBeCloseTo(6, 3);
});

it('RoundLoop polarLengthBetweenTermini - one inner stem (and includes stretch)', () => {
  let partners = parseDotBracket('..(((....))).....').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 1.2;
  gps.basePairBondLength = 0.8;
  let bps = defaultBaseProps(partners.length);
  bps[14].stretch3 = 2;
  let omst = new Stem(0, partners, gps, bps);
  expect(RoundLoop.polarLengthBetweenTermini(omst, gps)).toBeCloseTo(11.86158125878354, 3);
});

it('RoundLoop polarLengthBetweenTermini - does not use the termini gap', () => {
  // cannot be calculated by subtracting the termini gap from the circumference
  let partners = parseDotBracket('.(((....)))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 0.5;
  gps.basePairBondLength = 10;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  expect(RoundLoop.polarLengthBetweenTermini(omst, gps)).toBeCloseTo(13.001000000000001, 3);
});

it('RoundLoop terminusAngle5', () => {
  let partners = parseDotBracket('.(((....)))..').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 10;
  gps.basePairBondLength = 1;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  expect(
    normalizeAngle(RoundLoop.terminusAngle5(omst, gps))
  ).toBeCloseTo(5.098370175499026, 3);
});

it('RoundLoop terminusAngle5 - does not use termini gap', () => {
  let partners = parseDotBracket('.(((....)))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 0.5;
  gps.basePairBondLength = 10;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  expect(
    normalizeAngle(RoundLoop.terminusAngle5(omst, gps))
  ).toBeCloseTo(6.25558524513938, 3);
});

it('RoundLoop terminusAngle3', () => {
  let partners = parseDotBracket('.(((....)))..').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 10;
  gps.basePairBondLength = 1;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  expect(
    normalizeAngle(RoundLoop.terminusAngle3(omst, gps))
  ).toBeCloseTo(1.1848151316805602, 3);
});

it('RoundLoop terminusAngle3 - does not use termini gap', () => {
  let partners = parseDotBracket('.(((....)))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 0.5;
  gps.basePairBondLength = 10;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  expect(
    normalizeAngle(RoundLoop.terminusAngle3(omst, gps))
  ).toBeCloseTo(0.027600062040206375, 3);
});

it('RoundLoop setCoordinatesAndAngles - sets inner coordinates and angles', () => {
  let partners = parseDotBracket('..(((....)))......').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 5;
  gps.basePairBondLength = 3;
  let bps = defaultBaseProps(partners.length);
  let omst1 = new Stem(0, partners, gps, bps);
  let omst2 = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst1, gps, bps);
  RoundLoop.setInnerCoordinatesAndAngles(omst2, gps, bps);
  let it1 = omst1.loopIterator();
  let it2 = omst2.loopIterator();
  it1.next();
  let st1 = it1.next().value;
  it2.next();
  let st2 = it2.next().value;
  expect(st1.xBottomCenter).toBeCloseTo(st2.xBottomCenter, 3);
  expect(st1.yBottomCenter).toBeCloseTo(st2.yBottomCenter, 3);
  expect(normalizeAngle(st1.angle)).toBeCloseTo(normalizeAngle(st2.angle), 3);
});

it('RoundLoop setInnerCoordinatesAndAngles - zero inner stems', () => {
  let partners = [];
  let gps = new StrictLayoutGeneralProps();
  let bps = [];
  let omst = new Stem(0, partners, gps, bps);
  expect(
    () => RoundLoop.setInnerCoordinatesAndAngles(omst, gps, bps)
  ).not.toThrow();
});

it('RoundLoop setInnerCoordinatesAndAngles - an inner stem', () => {
  let partners = parseDotBracket('(((..(((.....)))..((...))....)))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 4;
  gps.basePairBondLength = 1.25;
  let bps = defaultBaseProps(partners.length);
  let st = new Stem(1, partners, gps, bps);
  st.xBottomCenter = 1;
  st.yBottomCenter = 1.5;
  st.angle = Math.PI / 6;
  RoundLoop.setInnerCoordinatesAndAngles(st, gps, bps);
  let it = st.loopIterator();
  it.next();
  let ist1 = it.next().value;
  it.next();
  let ist2 = it.next().value;
  expect(ist1.xBottomCenter).toBeCloseTo(6.981200118279215, 3);
  expect(ist1.yBottomCenter).toBeCloseTo(2.6031937793379676, 3);
  expect(normalizeAngle(ist1.angle)).toBeCloseTo(5.526073663189364, 3);
  expect(ist2.xBottomCenter).toBeCloseTo(6.393737195539805, 3);
  expect(ist2.yBottomCenter).toBeCloseTo(5.958468710066612, 3);
  expect(normalizeAngle(ist2.angle)).toBeCloseTo(1.1037705, 3);
});

it('RoundLoop setInnerCoordinatesAndAngles - the outermost stem (includes rotation)', () => {
  let partners = parseDotBracket('.(((.....))).....').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 0;
  gps.basePairBondLength = 1;
  gps.rotation = Math.PI / 5;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setInnerCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  it.next();
  let st = it.next().value;
  expect(st.xBottomCenter).toBeCloseTo(0.42185708156725427, 3);
  expect(st.yBottomCenter).toBeCloseTo(-0.38316014514653274, 3);
  expect(normalizeAngle(st.angle)).toBeCloseTo(5.545819870006258, 3);
});

it('RoundLoop setInnerCoordinatesAndAngles - the outermost stem (does not use termini gap)', () => {
  let partners = parseDotBracket('.(((....))).').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 0.8;
  gps.basePairBondLength = 8;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setInnerCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  it.next();
  let st = it.next().value;
  expect(st.xBottomCenter).toBeCloseTo(173.75229806916323, 3);
  expect(st.yBottomCenter).toBeCloseTo(-4.2557039134979516e-14, 3);
  expect(normalizeAngle(st.angle)).toBeCloseTo(0, 3);
});

it('RoundLoop setInnerCoordinatesAndAngles - includes stretch', () => {
  let partners = parseDotBracket('...(((....))).').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 0.9;
  gps.basePairBondLength = 10;
  let bps = defaultBaseProps(partners.length);
  bps[0].stretch3 = 1;
  bps[1].stretch3 = 1;
  bps[2].stretch3 = 1;
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setInnerCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  it.next();
  let st = it.next().value;
  expect(st.xBottomCenter).toBeCloseTo(234.94736952943967, 3);
  expect(st.yBottomCenter).toBeCloseTo(2.493964127282376, 3);
  expect(normalizeAngle(st.angle)).toBeCloseTo(0.0106145919, 3);
});

it('RoundLoop setInnerCoordinatesAndAngles - inner stems have inner stems (round loop)', () => {
  let partners = parseDotBracket('.(((..(((....))).....))).').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 0.9;
  gps.terminiGap = 4;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setInnerCoordinatesAndAngles(omst, gps, bps);
  let omit = omst.loopIterator();
  omit.next();
  let st = omit.next().value;
  let stit = st.loopIterator();
  stit.next();
  let ist = stit.next().value;
  expect(ist.xBottomCenter).toBeCloseTo(5.908798960029682, 3);
  expect(ist.yBottomCenter).toBeCloseTo(-0.8840679532813751, 3);
  expect(normalizeAngle(ist.angle)).toBeCloseTo(5.555366285, 3);
});

it('RoundLoop setInnerCoordinatesAngles - inner stems have inner stems (triangle loop)', () => {
  let partners = parseDotBracket('(((....(((....))).....(((....)))...)))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1.2;
  let bps = defaultBaseProps(partners.length);
  bps[0].loopShape = 'triangle';
  let omst = new Stem(0, partners, gps, bps);
  RoundLoop.setInnerCoordinatesAndAngles(omst, gps, bps);
  let omit = omst.loopIterator();
  omit.next();
  let st = omit.next().value;
  let stit = st.loopIterator();
  stit.next();
  let ist1 = stit.next().value;
  stit.next();
  let ist2 = stit.next().value;
  expect(ist1.xBottomCenter).toBeCloseTo(4.910689130419872, 3);
  expect(ist1.yBottomCenter).toBeCloseTo(-4.1, 3);
  expect(normalizeAngle(ist1.angle)).toBeCloseTo(normalizeAngle(st.angle), 3);
  expect(ist2.xBottomCenter).toBeCloseTo(4.9106891304198745, 3);
  expect(ist2.yBottomCenter).toBeCloseTo(4.1, 3);
  expect(normalizeAngle(ist2.angle)).toBeCloseTo(normalizeAngle(st.angle), 3);
});

it('TriangleLoop platformLength - a hairpin', () => {
  let partners = [6, 5, null, null, 2, 1];
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  bps[0].loopShape = 'triangle';
  let st = new Stem(1, partners, gps, bps);
  expect(TriangleLoop.platformLength(st)).toBe(0);
});

it('TriangleLoop platformLength - multiple branches (and includes stretch)', () => {
  let partners = parseDotBracket('((.(.)(.).))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 0.9;
  let bps = defaultBaseProps(partners.length);
  bps[0].loopShape = 'triangle';
  bps[5].stretch3 = 5.5;
  let st = new Stem(1, partners, gps, bps);
  expect(TriangleLoop.platformLength(st)).toBeCloseTo(11.3, 3);
});

it('TriangleLoop height - a hairpin', () => {
  let partners = parseDotBracket('((..))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  bps[0].loopShape = 'triangle';
  let st = new Stem(1, partners, gps, bps);
  expect(TriangleLoop.height(st)).toBe(0);
});

it('TriangleLoop height - one branch', () => {
  let partners = parseDotBracket('(.(..).)').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1.23;
  let bps = defaultBaseProps(partners.length);
  bps[0].loopShape = 'triangle';
  bps[1].stretch3 = 2.8;
  let st = new Stem(1, partners, gps, bps);
  expect(TriangleLoop.height(st)).toBe(TriangleLoop._heightOneBranch(st));
});

it('TriangleLoop height - multiple branches', () => {
  let partners = parseDotBracket('(.(.)..(.).)').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 2.87;
  gps.maxTriangleLoopAngle = 8 * Math.PI / 9;
  let bps = defaultBaseProps(partners.length);
  bps[0].loopShape = 'triangle';
  bps[1].stretch3 = 8.8;
  bps[5].stretch3 = 4.3;
  bps[9].stretch3 = -1;
  let st = new Stem(1, partners, gps, bps);
  expect(TriangleLoop.height(st)).toBe(TriangleLoop._heightMultipleBranches(st));
});

it("TriangleLoop _heightOneBranch - 5' side is greater (and includes stretch)", () => {
  let partners = parseDotBracket('(.(..).)').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1.23;
  let bps = defaultBaseProps(partners.length);
  bps[0].loopShape = 'triangle';
  bps[1].stretch3 = 5.3;
  let st = new Stem(1, partners, gps, bps);
  expect(TriangleLoop._heightOneBranch(st)).toBeCloseTo(3.647324338283344, 3);
});

it("TriangleLoop _heightOneBranch - 3' side is greater (and includes stretch)", () => {
  let partners = parseDotBracket('(.(..).)').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1.23;
  let bps = defaultBaseProps(partners.length);
  bps[0].loopShape = 'triangle';
  bps[6].stretch3 = 8.9;
  let st = new Stem(1, partners, gps, bps);
  expect(TriangleLoop._heightOneBranch(st)).toBeCloseTo(5.939155518806637, 3);
});

it('TriangleLoop _minHeightMultipleBranches - normal case', () => {
  let partners = parseDotBracket('((..((..))..((..)).))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1;
  let bps = defaultBaseProps(partners.length)
  bps[0].loopShape = 'triangle';
  bps[0].maxTriangleLoopAngle = 2 * Math.PI / 3;
  let st = new Stem(1, partners, gps, bps);
  expect(TriangleLoop._minHeightMultipleBranches(st)).toBeCloseTo(0.4433756729740652, 3);
});

it('TriangleLoop _minHeightMultipleBranches - max angle is too small', () => {
  let partners = parseDotBracket('((..((..))..((..)).))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1;
  let bps = defaultBaseProps(partners.length)
  bps[0].loopShape = 'triangle';
  bps[0].maxTriangleLoopAngle = 0;
  let st = new Stem(1, partners, gps, bps);
  let minHeight = TriangleLoop._minHeightMultipleBranches(st);
  expect(isFinite(minHeight)).toBeTruthy();
  expect(minHeight).toBeGreaterThanOrEqual(0);
});

it('TriangleLoop _minHeightMultipleBranches - max angle is too big', () => {
  let partners = parseDotBracket('((..((..))..((..)).))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1;
  let bps = defaultBaseProps(partners.length)
  bps[0].loopShape = 'triangle';
  bps[0].maxTriangleLoopAngle = Math.PI;
  let st = new Stem(1, partners, gps, bps);
  expect(TriangleLoop._minHeightMultipleBranches(st)).toBe(0);
});

it("TriangleLoop _heightMultipleBranches - 5' side is greater (and includes stretch)", () => {
  let partners = parseDotBracket('(.(.)..(.).)').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1.5;
  gps.maxTriangleLoopAngle = 8 * Math.PI / 9;
  let bps = defaultBaseProps(partners.length);
  bps[0].loopShape = 'triangle';
  bps[1].stretch3 = 18.8;
  let st = new Stem(1, partners, gps, bps);
  expect(TriangleLoop._heightMultipleBranches(st)).toBeCloseTo(19.61740769350017, 3);
});

it("TriangleLoop _heightMultipleBranches - 3' side is greater (and includes stretch)", () => {
  let partners = parseDotBracket('(.(.)..(.).)').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1.5;
  gps.maxTriangleLoopAngle = 8 * Math.PI / 9;
  let bps = defaultBaseProps(partners.length);
  bps[0].loopShape = 'triangle';
  bps[9].stretch3 = 15.6;
  let st = new Stem(1, partners, gps, bps);
  expect(TriangleLoop._heightMultipleBranches(st)).toBeCloseTo(16.38382869220702, 3);
});

it('TriangleLoop _heightMultipleBranches - both sides are too small and uses minHeight', () => {
  let partners = parseDotBracket('(.(.)..(.).)').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1.5;
  let bps = defaultBaseProps(partners.length);
  bps[0].loopShape = 'triangle';
  bps[0].maxTriangleLoopAngle = 8 * Math.PI / 9;
  bps[5].stretch3 = 100.6;
  let st = new Stem(1, partners, gps, bps);
  expect(
    TriangleLoop._heightMultipleBranches(st)
  ).toBe(TriangleLoop._minHeightMultipleBranches(st));
});

it('TriangleLoop setInnerCoordinatesAndAngles - a hairpin', () => {
  let partners = parseDotBracket('((..))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  bps[0].loopShape = 'triangle';
  let st = new Stem(1, partners, gps, bps);
  expect(
    () => TriangleLoop.setInnerCoordinatesAndAngles(st, gps, bps)
  ).not.toThrow();
});

it('TriangleLoop setInnerCoordinatesAndAngles - one branch', () => {
  let partners = parseDotBracket('(.(..).)').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1.29;
  let bps = defaultBaseProps(partners.length);
  bps[0].loopShape = 'triangle';
  bps[1].stretch3 = 4.8;
  let ost = new Stem(1, partners, gps, bps);
  ost.xBottomCenter = 1.2;
  ost.yBottomCenter = 3.4;
  ost.angle = Math.PI / 6;
  TriangleLoop.setInnerCoordinatesAndAngles(ost, gps, bps);
  let it = ost.loopIterator();
  it.next();
  let ist = it.next().value;
  expect(ist.xBottomCenter).toBeCloseTo(4.949036488868186, 3);
  expect(ist.yBottomCenter).toBeCloseTo(5.564507226049776, 3);
  expect(ist.angle).toBeCloseTo(Math.PI / 6 , 3);
});

it('TriangleLoop setInnerCoordinatesAndAngles - multiple branches', () => {
  let partners = parseDotBracket('(.((...))..(((...))).)').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1;
  gps.maxTriangleLoopAngle = 8 * Math.PI / 9;
  let bps = defaultBaseProps(partners.length);
  bps[0].loopShape = 'triangle';
  bps[1].stretch3 = 15;
  let ost = new Stem(1, partners, gps, bps);
  ost.xBottomCenter = 5.6;
  ost.yBottomCenter = 7.8;
  ost.angle = -Math.PI / 3;
  TriangleLoop.setInnerCoordinatesAndAngles(ost, gps, bps);
  let it = ost.loopIterator();
  it.next();
  let ist1 = it.next().value;
  it.next();
  let ist2 = it.next().value;
  expect(ist1.xBottomCenter).toBeCloseTo(11.842522350939024, 3);
  expect(ist1.yBottomCenter).toBeCloseTo(-8.0123658792107, 3);
  expect(ist1.angle).toBeCloseTo(-Math.PI / 3, 3);
  expect(ist2.xBottomCenter).toBeCloseTo(16.17264936986122, 3);
  expect(ist2.yBottomCenter).toBeCloseTo(-5.5123658792107, 3);
  expect(ist2.angle).toBeCloseTo(-Math.PI / 3, 3);
});

it('TriangleLoop setInnerCoordinatesAndAngles - inner stems have inner stems (round loop)', () => {
  let partners = parseDotBracket('(.(((.).(.).)).)').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1.6;
  let bps = defaultBaseProps(partners.length);
  bps[2].loopShape = 'round';
  let ost = new Stem(1, partners, gps, bps);
  ost.xBottomCenter = -1.2;
  ost.yBottomCenter = 3.5;
  ost.angle = Math.PI / 5;
  TriangleLoop.setInnerCoordinatesAndAngles(ost, gps, bps);

  let oit = ost.loopIterator();
  oit.next();
  let ist1 = oit.next().value;
  expect(ist1.hasRoundLoop()).toBeTruthy();

  let ist2 = new Stem(3, partners, gps, bps);
  ist2.xBottomCenter = ist1.xBottomCenter;
  ist2.yBottomCenter = ist1.yBottomCenter;
  ist2.angle = ist1.angle;
  RoundLoop.setInnerCoordinatesAndAngles(ist2, gps, bps);

  let it1 = ist1.loopIterator();
  let it2 = ist2.loopIterator();
  for (let i = 0; i < 2; i++) {
    it1.next();
    let st1 = it1.next().value;
    it2.next();
    let st2 = it2.next().value;
    expect(st1.xBottomCenter).toBeCloseTo(st2.xBottomCenter, 3);
    expect(st1.yBottomCenter).toBeCloseTo(st2.yBottomCenter, 3);
    expect(st1.angle).toBeCloseTo(st2.angle, 3);
  }
});

it('TriangleLoop setInnerCoordinatesAndAngles - inner stems have inner stems (triangle loop)', () => {
  let partners = parseDotBracket('(.(((.).(.).)).)').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 0.6;
  gps.maxTriangleLoopAngle = 8 * Math.PI / 9;
  let bps = defaultBaseProps(partners.length);
  bps[2].loopShape = 'triangle';
  let ost = new Stem(1, partners, gps, bps);
  ost.xBottomCenter = -10;
  ost.yBottomCenter = -3;
  ost.angle = -Math.PI / 5;
  TriangleLoop.setInnerCoordinatesAndAngles(ost, gps, bps);

  let oit = ost.loopIterator();
  oit.next();
  let ist1 = oit.next().value;
  expect(ist1.hasTriangleLoop()).toBeTruthy();

  let ist2 = new Stem(3, partners, gps, bps);
  ist2.xBottomCenter = ist1.xBottomCenter;
  ist2.yBottomCenter = ist1.yBottomCenter;
  ist2.angle = ist1.angle;
  TriangleLoop.setInnerCoordinatesAndAngles(ist2, gps, bps);

  let it1 = ist1.loopIterator();
  let it2 = ist2.loopIterator();
  for (let i = 0; i < 2; i++) {
    it1.next();
    let st1 = it1.next().value;
    it2.next();
    let st2 = it2.next().value;
    expect(st1.xBottomCenter).toBeCloseTo(st2.xBottomCenter, 3);
    expect(st1.yBottomCenter).toBeCloseTo(st2.yBottomCenter, 3);
    expect(st1.angle).toBeCloseTo(st2.angle, 3);
  }
});

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
    FlatOutermostLoop.traverseUnpairedRegion53(ur, gps, bps).length
  ).toBe(0);
});

it("FlatoutermostLoop traverseUnpairedRegion53 - size of one and an inner 5' stem", () => {
  // and includes stretch and angles
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
    FlatOutermostLoop.traverseUnpairedRegion53(ur, gps, bps),
    [
      [-3.1936791509797766, 4.492148299476559],
    ],
  );
});

it("FlatOutermostLoop traverseUnpairedRegion53 - size of four and an inner 5' stem", () => {
  // and includes stretch and angles
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
    FlatOutermostLoop.traverseUnpairedRegion53(ur, gps, bps),
    [
      [3.528912231189045, 3.3970473189814863],
      [4.137673660197765, 4.190400659272721],
      [9.333826082904398, 7.190400659272721],
      [10.199851486688837, 7.690400659272721],
    ],
  );
});

it("FlatOutermost traverseUnpairedRegion53 - 5' dangling unpaired region", () => {
  // and uses rotation of layout
  let partners = [null, null, null, 6, null, 4, null];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  gps.rotation = Math.PI / 6;
  let bps = defaultBaseProps(partners.length);
  bps[0].stretch3 = 2;
  bps[0].flatOutermostLoopAngle3 = Math.PI / 3;
  bps[1].stretch3 = 10;
  bps[1].flatOutermostLoopAngle3 = -Math.PI / 2;
  
  let outermostStem = new Stem(0, partners, gps, bps);
  let it = outermostStem.loopIterator();
  let ur = it.next().value;
  
  checkCoords(
    FlatOutermostLoop.traverseUnpairedRegion53(ur, gps, bps),
    [
      [0.8660254037844387, 0.49999999999999994],
      [0.8660254037844389, 3.5],
      [11.86602540378444, 3.5],
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

  FlatOutermostLoop.setNextCoordinatesAndAngle53(ur, gps, bps);
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
  
  FlatOutermostLoop.setNextCoordinatesAndAngle53(ur, gps, bps);
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

  FlatOutermostLoop.setNextCoordinatesAndAngle53(ur, gps, bps);
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

  FlatOutermostLoop.setNextCoordinatesAndAngle53(ur, gps, bps);
  expect(st3.angle).toBeCloseTo((Math.PI / 6) - (Math.PI / 2), 3);
  let bc5 = st3.baseCoordinates5();
  expect(bc5.xCenter).toBeCloseTo(4.444486372867091, 3);
  expect(bc5.yCenter).toBeCloseTo(2.1999999999999997, 3);
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

  FlatOutermostLoop.setNextCoordinatesAndAngle53(ur, gps, bps);
  expect(normalizeAngle(st3.angle, 0)).toBeCloseTo(3.2114058236695664, 3);
  let bc5 = st3.baseCoordinates5();
  expect(bc5.xCenter).toBeCloseTo(9.466185473744124, 3);
  expect(bc5.yCenter).toBeCloseTo(-6.362333050259824, 3);
});

it('FlatOutermostLoop setCoordinatesAndAngles - uses rotation general property', () => {
  let partners = parseDotBracket('.....(((....)))...').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  gps.rotation = Math.PI / 3;
  let bps = defaultBaseProps(partners.length);
  bps[2].flatOutermostLoopAngle3 = Math.PI / 3;
  bps[2].stretch3 = 2;
  let omst = new Stem(0, partners, gps, bps);
  FlatOutermostLoop.setCoordinatesAndAngles(omst, gps, bps);
  let it = omst.loopIterator();
  it.next();
  let st = it.next().value;
  expect(st.xBottomCenter).toBeCloseTo(-1.4830127018922186, 3);
  expect(st.yBottomCenter).toBeCloseTo(8.130831174438391, 3);
  expect(normalizeAngle(st.angle)).toBeCloseTo(0.5235987755982991, 3);
});

it('FlatOutermostLoop setCoordinatesAndAngles - sequence of length zero', () => {
  let partners = [];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  gps.rotation = Math.PI / 3;
  let bps = [];

  let outermostStem = new Stem(0, partners, gps, bps);
  expect(
    () => FlatOutermostLoop.setCoordinatesAndAngles(outermostStem, gps, bps)
  ).not.toThrow();
});

it('FlatOutermostLoop setCoordinatesAndAngles - zero stems', () => {
  let partners = [null, null, null];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  gps.rotation = -Math.PI / 6;
  let bps = defaultBaseProps(partners.length);
  let outermostStem = new Stem(0, partners, gps, bps);
  expect(
    () => FlatOutermostLoop.setCoordinatesAndAngles(outermostStem, gps, bps)
  ).not.toThrow();
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
  FlatOutermostLoop.setCoordinatesAndAngles(omst1, gps, bps);
  
  let omst2 = new Stem(0, partners, gps, bps);
  let it2 = omst2.loopIterator();
  let ur2 = it2.next().value;
  let st2 = it2.next().value;
  FlatOutermostLoop.setNextCoordinatesAndAngle53(ur2, gps, bps);
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
  let omst2 = new Stem(0, partners, gps, bps);
  let it1 = omst1.loopIterator();
  let it2 = omst2.loopIterator();
  
  for (let i = 0; i < 3; i++) {
    let ur2 = it2.next().value;
    FlatOutermostLoop.setNextCoordinatesAndAngle53(ur2, gps, bps);
    
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

it('StemLayout setCoordinatesAndAngles - flat outermost loop', () => {
  let partners = parseDotBracket('.(((...)))...').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  let bps = defaultBaseProps(partners.length);
  let omst1 = new Stem(0, partners, gps, bps);
  let omst2 = new Stem(0, partners, gps, bps);
  StemLayout.setCoordinatesAndAngles(omst1, gps, bps);
  FlatOutermostLoop.setCoordinatesAndAngles(omst2, gps, bps);
  let expectedCoords = [];
  omst2.baseCoordinates().forEach(c => expectedCoords.push([c.xLeft, c.yTop]));
  checkCoords(
    omst1.baseCoordinates(),
    expectedCoords,
  );
});

it('StemLayout setCoordinatesAndAngles - round outermost loop', () => {
  let partners = parseDotBracket('.(((...)))...').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = false;
  let bps = defaultBaseProps(partners.length);
  let omst1 = new Stem(0, partners, gps, bps);
  let omst2 = new Stem(0, partners, gps, bps);
  StemLayout.setCoordinatesAndAngles(omst1, gps, bps);
  RoundLoop.setCoordinatesAndAngles(omst2, gps, bps);
  let expectedCoords = [];
  omst2.baseCoordinates().forEach(c => expectedCoords.push([c.xLeft, c.yTop]));
  checkCoords(
    omst1.baseCoordinates(),
    expectedCoords,
  );
});

it('StemLayout setInnerCoordinatesAndAngles - round loop', () => {
  let partners = parseDotBracket('..(((...(((...)))..(((...)))..))).').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  bps[2].loopShape = 'round';
  let st1 = new Stem(3, partners, gps, bps);
  let st2 = new Stem(3, partners, gps, bps);
  st1.xBottomCenter = 2;
  st2.xBottomCenter = 2;
  st1.yBottomCenter = 2.5;
  st2.yBottomCenter = 2.5;
  st1.angle = Math.PI / 3;
  st2.angle = Math.PI / 3;
  StemLayout.setInnerCoordinatesAndAngles(st1, gps, bps);
  RoundLoop.setInnerCoordinatesAndAngles(st2, gps, bps);
  let expectedCoords = [];
  st2.baseCoordinates().forEach(c => expectedCoords.push([c.xLeft, c.yTop]));
  checkCoords(
    st1.baseCoordinates(),
    expectedCoords,
  );
});

it('StemLayout setInnerCoordinatesAndAngles - triangle loop', () => {
  let partners = parseDotBracket('..(((...(((...)))..(((...)))..))).').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  bps[2].loopShape = 'triangle';
  let st1 = new Stem(3, partners, gps, bps);
  let st2 = new Stem(3, partners, gps, bps);
  st1.xBottomCenter = 2;
  st2.xBottomCenter = 2;
  st1.yBottomCenter = 2.5;
  st2.yBottomCenter = 2.5;
  st1.angle = Math.PI / 3;
  st2.angle = Math.PI / 3;
  StemLayout.setInnerCoordinatesAndAngles(st1, gps, bps);
  TriangleLoop.setInnerCoordinatesAndAngles(st2, gps, bps);
  let expectedCoords = [];
  st2.baseCoordinates().forEach(c => expectedCoords.push([c.xLeft, c.yTop]));
  checkCoords(
    st1.baseCoordinates(),
    expectedCoords,
  );
});
