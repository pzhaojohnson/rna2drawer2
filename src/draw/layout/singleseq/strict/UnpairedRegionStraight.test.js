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
      [2.9526279441628827, -2.45],
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
      [3.2473720558371184, 7.42820323027551],
      [2.2473720558371184, 7.42820323027551],
      [1.2473720558371184, 7.42820323027551],
      [0.2473720558371184, 7.42820323027551],
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
      [0.32255483321266576, 7.4282032302755105],
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
      [0.10130749540706963, 17.096749443864798],
      [-0.48647775688540373, 16.28773244948985],
      [-5.81809904475366, 8.949385302068755],
      [-6.405884297046133, 8.140368307693809],
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
      [-8.61410273549037, 5.101016372568072],
      [-9.201887987782843, 4.2919993781931245],
      [-9.789673240075317, 3.482982383818177],
      [-15.094033440853464, -3.817843096199704],
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
      [0.10130749540706963, 17.096749443864798],
      [-0.48647775688540373, 16.28773244948985],
      [-14.50624818856099, -3.0088261018247557],
      [-15.094033440853464, -3.817843096199703],
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
      [0.10130749540706963, 17.096749443864798],
      [-0.48647775688540373, 16.28773244948985],
      [-14.50624818856099, -3.0088261018247557],
      [-15.094033440853464, -3.817843096199703],
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
      [-6.412026719835259, -8.098937355228028],
      [-5.498481262192659, -8.505673998303829],
      [-4.584935804550058, -8.91241064137963],
      [-3.671390346907458, -9.31914728445543],
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
      [-6.412026719835259, -8.098937355228028],
      [-4.498382751691679, -8.950946543313204],
      [-3.5848372940490787, -9.357683186389005],
      [-2.671291836406478, -9.764419829464806],
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
