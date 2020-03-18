import baseCoordinatesStraight from './UnpairedRegionStraight';
import StrictLayoutGeneralProps from './StrictLayoutGeneralProps';
import StrictLayoutBaseProps from './StrictLayoutBaseProps';
import Stem from './Stem';

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

it('length zero', () => {
  let partners = [3, null, 1, 6, null, 4];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = -Math.PI / 3;
  bs5.xBottomCenter = 2;
  bs5.yBottomCenter = -4;
  bs3.angle = Math.PI / 3;
  bs3.xBottomCenter = 2;
  bs3.yBottomCenter = 4;

  let coords = baseCoordinatesStraight(ur, bps);
  expect(coords.length).toBe(0);
});

it('sequence of length zero', () => {
  let partners = [];
  let gps = new StrictLayoutGeneralProps();
  let bps = [];

  let st = new Stem(0, partners, gps, bps);
  st.angle = -Math.PI / 2;
  st.xBottomCenter = 0;
  st.yBottomCenter = 0;

  let it = st.loopIterator();
  let ur = it.next().value;

  let coords = baseCoordinatesStraight(ur, bps);
  expect(coords.length).toBe(0);
});

it("size of one - zero 3' stretches", () => {
  let partners = [3, null, 1, null, 7, null, 5];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = -Math.PI / 3;
  bs5.xBottomCenter = 2;
  bs5.yBottomCenter = -3.5;
  bs3.angle = Math.PI / 3;
  bs3.xBottomCenter = 2;
  bs3.yBottomCenter = 3.5;

  checkCoords(
    baseCoordinatesStraight(ur, bps),
    [
      [3.2026279441628827, -2.3830127018922194],
    ],
  );
});

it("size of four - zero 3' stretches", () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = Math.PI / 3;
  bs5.xBottomCenter = 5.200000000000001;
  bs5.yBottomCenter = 7.378203230275509;
  bs3.angle = 2 * Math.PI / 3;
  bs3.xBottomCenter = -2.799999999999998;
  bs3.yBottomCenter = 7.37820323027551;
  
  checkCoords(
    baseCoordinatesStraight(ur, bps),
    [
      [3.497372055837119, 8.36121593216773],
      [2.497372055837119, 8.36121593216773],
      [1.4973720558371189, 8.36121593216773],
      [0.49737205583711885, 8.36121593216773],
    ],
  );
});

it("size of one - some positive 3' stretches", () => {
  let partners = [3, null, 1, null, 7, null, 5];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);
  bps[2].stretch3 = 2.5;
  bps[3].stretch3 = 1;

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = Math.PI / 3;
  bs5.xBottomCenter = 5.200000000000001;
  bs5.yBottomCenter = 7.378203230275509;
  bs3.angle = 2 * Math.PI / 3;
  bs3.xBottomCenter = -2.799999999999998;
  bs3.yBottomCenter = 7.37820323027551;

  checkCoords(
    baseCoordinatesStraight(ur, bps),
    [
      [0.215411976069809, 8.361215932167731],
    ],
  );
});

it("size of four - some positive 3' stretches", () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);
  bps[4].stretch3 = 8.9;
  bps[6].stretch3 = 16.3;

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = 2 * Math.PI / 5;
  bs5.xBottomCenter = 1.7352549156242119;
  bs5.yBottomCenter = 18.065847744427302;
  bs3.angle = 6 * Math.PI / 5;
  bs3.xBottomCenter = -15.035254915624213;
  bs3.yBottomCenter = -5.016778784387095;

  checkCoords(
    baseCoordinatesStraight(ur, bps),
    [
      [0.25581599259454346, 18.072277702012375],
      [-0.33196925969792956, 17.26326070763743],
      [-5.861021152722413, 9.653173644731611],
      [-6.448806405014887, 8.844156650356663],
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
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = 2 * Math.PI / 5;
  bs5.xBottomCenter = 1.7352549156242119;
  bs5.yBottomCenter = 18.065847744427302;
  bs3.angle = 6 * Math.PI / 5;
  bs3.xBottomCenter = -15.035254915624213;
  bs3.yBottomCenter = -5.016778784387095;

  checkCoords(
    baseCoordinatesStraight(ur, bps),
    [
      [-8.82231518885152, 5.577302072204395],
      [-9.410100441143994, 4.768285077829447],
      [-9.997885693436467, 3.9592680834545],
      [-15.498541938040928, -3.6117357223459425],
    ],
  );
});

it("5' bounding position is zero and 3' bounding position one greater than the sequence length", () => {
  let partners = [null, null, null, null];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  st.angle = -Math.PI / 2;
  st.xBottomCenter = 0;
  st.yBottomCenter = 0;

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
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = 2 * Math.PI / 5;
  bs5.xBottomCenter = 1.7352549156242119;
  bs5.yBottomCenter = 18.065847744427302;
  bs3.angle = 6 * Math.PI / 5;
  bs3.xBottomCenter = -15.035254915624213;
  bs3.yBottomCenter = -5.016778784387095;

  checkCoords(
    baseCoordinatesStraight(ur, bps),
    [
      [0.25581599259454346, 18.072277702012375],
      [-0.33196925969792956, 17.26326070763743],
      [-14.910756685748455, -2.802718727970994],
      [-15.498541938040928, -3.6117357223459416],
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
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = 2 * Math.PI / 5;
  bs5.xBottomCenter = 1.7352549156242119;
  bs5.yBottomCenter = 18.065847744427302;
  bs3.angle = 6 * Math.PI / 5;
  bs3.xBottomCenter = -15.035254915624213;
  bs3.yBottomCenter = -5.016778784387095;

  checkCoords(
    baseCoordinatesStraight(ur, bps),
    [
      [0.25581599259454346, 18.072277702012375],
      [-0.33196925969792956, 17.26326070763743],
      [-14.910756685748455, -2.802718727970994],
      [-15.498541938040928, -3.6117357223459416],
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
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = 6 * Math.PI / 5;
  bs5.xBottomCenter = -7.97213595499958;
  bs5.yBottomCenter = -6.302282018339785;
  bs3.angle = bs5.angle + Math.PI / 3;
  bs3.xBottomCenter = -0.6637722938587761;
  bs3.yBottomCenter = -9.556175162946188;

  checkCoords(
    baseCoordinatesStraight(ur, bps),
    [
      [-6.816535217022731, -7.892829981374264],
      [-5.90298975938013, -8.299566624450065],
      [-4.989444301737529, -8.706303267525866],
      [-4.075898844094928, -9.113039910601668],
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
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = 6 * Math.PI / 5;
  bs5.xBottomCenter = -7.97213595499958;
  bs5.yBottomCenter = -6.302282018339785;
  bs3.angle = bs5.angle + Math.PI / 3;
  bs3.xBottomCenter = -0.6637722938587761;
  bs3.yBottomCenter = -9.556175162946188;
  
  checkCoords(
    baseCoordinatesStraight(ur, bps),
    [
      [-6.816535217022731, -7.892829981374264],
      [-4.446118520057852, -8.94820749099734],
      [-3.532573062415251, -9.354944134073142],
      [-2.61902760477265, -9.761680777148943],
    ],
  );
});

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
xs += ur.baseCoordinatesBounding3().xCenter + '\n';
ys += ur.baseCoordinatesBounding3().yCenter + '\n';
console.log(xs);
console.log(ys);
let s = '';
coords.forEach(vbc => {
  s += '[';
  s += vbc.xCenter + ', ';
  s += vbc.yCenter + '],\n';
});
console.log(s);
*/
