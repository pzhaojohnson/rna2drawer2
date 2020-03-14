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
      [-0.224963654251635, -4.3485933710708],
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
      [-1.5810745754423188, -4.605432183873244],
      [-0.6384177911025934, -4.93919585316379],
      [0.3042389932371319, -5.272959522454336],
      [1.2468957775768572, -5.606723191744882],
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
      [-2.2268534577401278, -4.470567697807208],
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
      [-3.69027994402699, -3.2189084116367397],
      [-2.7720905290899513, -3.6150500508235055],
      [0.9790406912073379, -5.233429925650442],
      [1.8972301061443768, -5.6295715648372076],
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
      [-0.019269015406453427, -5.138077018669779],
      [0.9009910837742154, -5.529384250721507],
      [1.8212511829548843, -5.920691482773235],
      [4.5351681735596845, -7.074686257247566],
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
      [-2.649673368949248, -4.280498321318589],
      [-1.7231210704829234, -4.656664292941185],
      [1.4284615973049717, -5.936158346692597],
      [2.355013895771296, -6.312324318315193],
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
      [-0.7833925836624744, -4.545269907478754],
      [0.17696535866162322, -4.824039745544182],
      [1.1373233009857209, -5.10280958360961],
      [2.0976812433098186, -5.381579421675038],
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
      [-0.7833925836624744, -4.545269907478754],
      [0.17696535866162322, -4.824039745544182],
      [1.1373233009857209, -5.10280958360961],
      [2.0976812433098186, -5.381579421675038],
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
      [-2.1195967757138408, -4.505117220083039],
      [-0.5115150613034158, -5.122668545854815],
      [0.4220135775257675, -5.481171377762363],
      [1.3555422163549509, -5.839674209669912],
    ],
  );
});
