import baseCoordinatesStraight from './UnpairedRegionStraight';
import StrictLayoutGeneralProps from './StrictLayoutGeneralProps';
import StrictLayoutBaseProps from './StrictLayoutBaseProps';
import Stem from './Stem';
import { RoundLoop } from './StemLayout';

function zeroStretch3(length) {
  let bps = [];
  for (let i = 0; i < length; i++) {
    bps.push(new StrictLayoutBaseProps());
    bps[i].stretch3 = 0;
  }
  return bps;
}

function checkCoords(coords, expectedCoords) {
  expect(coords.length).toBe(expectedCoords.length);

  for (let i = 0; i < expectedCoords.length; i++) {
    expect(coords[i].xCenter).toBeCloseTo(expectedCoords[i][0], 3);
    expect(coords[i].yCenter).toBeCloseTo(expectedCoords[i][1], 3);
  }
}

it('unpaired region of size zero', () => {
  let partners = [3, null, 1, 6, null, 4];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(st, gps, bps);

  let it = st.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;

  let coords = baseCoordinatesStraight(ur, bps);
  expect(coords.length).toBe(0);
});

it('sequence of length zero', () => {
  let partners = [];
  let gps = new StrictLayoutGeneralProps();
  let bps = [];

  let st = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(st, gps, bps);

  let it = st.loopIterator();
  let ur = it.next().value;

  let coords = baseCoordinatesStraight(ur, bps);
  expect(coords.length).toBe(0);
});

it("unpaired region of size one and no 3' stretches", () => {
  let partners = [3, null, 1, null, 7, null, 5];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(st, gps, bps);

  let it = st.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;
  
  checkCoords(
    baseCoordinatesStraight(ur, bps),
    [
      [1.0083805929957363, -2.6373668397977594],
    ],
  );
});

it("unpaired region of size four and no 3' stretches", () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(st, gps, bps);

  let it = st.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;

  checkCoords(
    baseCoordinatesStraight(ur, bps),
    [
      [-0.5367850999265737, -3.840973744811367],
      [0.4456008516034159, -3.654110580339294],
      [1.4279868031334055, -3.4672474158672215],
      [2.410372754663395, -3.280384251395149],
    ],
  );
});

it("unpaired region of size one with positive 3' stretches", () => {
  let partners = [3, null, 1, null, 7, null, 5];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);
  bps[3].stretch3 = 5.5;

  let st = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(st, gps, bps);

  let it = st.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;

  checkCoords(
    baseCoordinatesStraight(ur, bps),
    [
      [-1.3619741155273104, -3.9879881262738923],
    ],
  );
});

it("unpaired region of size four with positive 3' stretches", () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);
  bps[4].stretch3 = 8.9;
  bps[6].stretch3 = 16.3;

  let st = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(st, gps, bps);

  let it = st.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;

  checkCoords(
    baseCoordinatesStraight(ur, bps),
    [
      [-3.248855975071919, -2.9574633410508357],
      [-2.248871558734278, -2.951880592456517],
      [-0.03146020339085398, -2.9395011494123855],
      [0.968524212946787, -2.9339184008180665],
    ],
  );
});

it("uses 3' stretch of 5' bounding position", () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);
  bps[2].stretch3 = 8.5;
  bps[5].stretch3 = 4.6;

  let st = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(st, gps, bps);

  let it = st.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;

  checkCoords(
    baseCoordinatesStraight(ur, bps),
    [
      [-1.164246837440242, -3.438377340444753],
      [-0.16440196616343272, -3.42076389724188],
      [0.8354429051133765, -3.403150454039007],
      [2.7088284381249688, -3.370148564815285],
    ],
  );
});

it("5' bounding position is zero and 3' bounding position one greater than the sequence length", () => {
  let partners = [null, null, null, null];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(st, gps, bps);

  let it = st.loopIterator();
  let ur = it.next().value;

  checkCoords(
    baseCoordinatesStraight(ur, bps),
    [
      [-0.5, -0.5000000000000002],
      [0.5, -0.5000000000000002],
      [1.5, -0.5000000000000002],
      [2.5, -0.5000000000000002],
    ],
  );
});

it("some negative 3' stretches that sum to less than the positive 3' stretches", () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);
  bps[4].stretch3 = 10;
  bps[5].stretch3 = -5;

  let st = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(st, gps, bps);

  let it = st.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;

  checkCoords(
    baseCoordinatesStraight(ur, bps),
    [
      [-1.898190343370043, -3.9149176665089316],
      [-0.8998074449490914, -3.858070607301091],
      [0.8946469775276726, -3.7558959236585263],
      [1.8930298759486242, -3.6990488644506856],
    ],
  );
});

it("some negative 3' stretches that sum to more than the positive 3' stretches", () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);
  bps[4].stretch3 = 5;
  bps[5].stretch3 = -10;

  let st = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(st, gps, bps);

  let it = st.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;

  checkCoords(
    baseCoordinatesStraight(ur, bps),
    [
      [0.7094379187888562, -2.7137162930521184],
      [1.557949882780327, -2.184540096532153],
      [2.4064618467717978, -1.6553639000121878],
      [3.2549738107632686, -1.1261877034922225],
    ],
  );
});

it("all 3' stretches are negative", () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);
  bps[2].stretch3 = -2.5;
  bps[3].stretch3 = -8;
  bps[4].stretch3 = -5;
  bps[5].stretch3 = -0.5;
  bps[6].stretch3 = -3.4;

  let st = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(st, gps, bps);

  let it = st.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;

  checkCoords(
    baseCoordinatesStraight(ur, bps),
    [
      [0.7094379187888562, -2.7137162930521184],
      [1.557949882780327, -2.184540096532153],
      [2.4064618467717978, -1.6553639000121878],
      [3.2549738107632686, -1.1261877034922225],
    ],
  );
});

it("3' stretch of 5' bounding position is negative", () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);
  bps[2].stretch3 = -6;
  bps[3].stretch3 = 8;
  
  let st = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(st, gps, bps);

  let it = st.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;

  checkCoords(
    baseCoordinatesStraight(ur, bps),
    [
      [-1.226125850652306, -3.9857798555049015],
      [-0.23181610177658563, -3.8792522849388664],
      [0.7624936470991348, -3.7727247143728313],
      [1.7568033959748552, -3.666197143806796],
    ],
  );
});
