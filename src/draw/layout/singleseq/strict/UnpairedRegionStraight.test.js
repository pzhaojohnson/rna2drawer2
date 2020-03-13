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
  let it = st.loopIterator();
  it.next();
  it.next();
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
  /*
  let coords = baseCoordinatesStraight(ur, bps);

  let xs = '';
  let ys = '';
  xs += ur.baseCoordinatesBounding5().xCenter + '\n';
  ys += ur.baseCoordinatesBounding5().yCenter + '\n';
  coords.forEach(vbc => {
    xs += vbc.xCenter + '\n';
    ys += vbc.yCenter + '\n';
  });
  xs += ur.baseCoordinatesBounding3().xCenter;
  ys += ur.baseCoordinatesBounding3().yCenter;
  console.log(xs);
  console.log(ys);
  
  */

  /*
  let coords = baseCoordinatesStraight(ur, bps);
  let s = '';
  coords.forEach(vbc => {
    s += '[';
    s += vbc.xCenter + ', ';
    s += vbc.yCenter + '],\n';
  });
  console.log(s);
  */
});

it("uses 3' stretch of 5' bounding position", () => {});

it("5' bounding position is zero and 3' bounding position one greater than the sequence length", () => {});

it("unpaired region of size four with some negative 3' stretches", () => {});
