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
      [3.2026279441628827, -0.0005000000000006111],
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
      [3.178623233502272, 8.36121593216773],
      [1.8598744111674255, 8.36121593216773],
      [0.5411255888325788, 8.36121593216773],
      [-0.7776232335022679, 8.36121593216773],
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
      [0.4500000000000015, 8.361215932167731],
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
      [-5.99856172563681, 9.463865286840987],
      [-7.844550051674615, 6.9230803294817065],
      [-9.69053837771242, 4.382295372122426],
      [-14.2403388642956, -1.8799677593616124],
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
      [-0.8999999999999999, -0.5000000000000002],
      [-0.29999999999999993, -0.5000000000000002],
      [0.30000000000000004, -0.5000000000000002],
      [0.9, -0.5000000000000002],
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
      [-1.3668139375721209, 15.838919202515575],
      [-3.5772291200312587, 12.796543708643828],
      [-11.665496825415126, 1.6639982710226047],
      [-13.875912007874263, -1.3783772228491427],
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
      [-1.9545991898645942, 15.029902208140626],
      [-4.752799624616205, 11.178509719893931],
      [-10.48992632083018, 3.2820322597724987],
      [-13.288126755581791, -0.5693602284741965],
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
      [-6.525343678249804, -8.022476807355105],
      [-5.320606681834276, -8.558860276411746],
      [-4.1158696854187475, -9.095243745468387],
      [-2.911132689003219, -9.631627214525029],
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
