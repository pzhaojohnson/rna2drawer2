import baseCoordinatesHairpin from './UnpairedRegionHairpin';
import StrictLayoutGeneralProps from './StrictLayoutGeneralProps';
import StrictLayoutBaseProps from './StrictLayoutBaseProps';
import Stem from './Stem';

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
    expect(coords[i].xCenter).toBeCloseTo(expectedCoords[i][0], 3);
    expect(coords[i].yCenter).toBeCloseTo(expectedCoords[i][1], 3);
  }
}

it('empty hairpin', () => {
  let partners = [6, 5, 4, 3, 2, 1];
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);

  let st = new Stem(1, partners, gps, bps);
  let it = st.loopIterator();
  let ur = it.next().value;

  let coords = baseCoordinatesHairpin(ur);
  expect(coords.length).toBe(0);
});

it('one base hairpin', () => {
  let partners = [7, 6, 5, null, 3, 2, 1];
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 0.788;
  let bps = defaultBaseProps(partners.length);

  let st = new Stem(1, partners, gps, bps);
  st.xBottomCenter = 10;
  st.yBottomCenter = 11;
  st.angle = Math.PI / 3;

  let it = st.loopIterator();
  let ur = it.next().value;

  checkCoords(
    baseCoordinatesHairpin(ur),
    [
      [11.75404524600048, 14.038095484847467],
    ],
  );
});

it('four base hairpin', () => {
  let partners = [8, 7, null, null, null, null, 2, 1];
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 0.34;
  let bps = defaultBaseProps(partners.length);

  let st = new Stem(1, partners, gps, bps);
  st.xBottomCenter = -0.55;
  st.yBottomCenter = 1.24;
  st.angle = 5 * Math.PI / 3;

  let it = st.loopIterator();
  let ur = it.next().value;

  checkCoords(
    baseCoordinatesHairpin(ur),
    [
      [-0.17086917610115404, -1.1378128914319392],
      [0.5448427027781856, -1.4290041217934233],
      [1.214004020889388, -1.0426636546506356],
      [1.3196809574767658, -0.2772433705700946],
    ],
  );
});

it('big hairpin', () => {
  let partners = [14, 13, null, null, null, null, null, null, null, null, null, null, 2, 1];
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 0.8;
  let bps = defaultBaseProps(partners.length);

  let st = new Stem(1, partners, gps, bps);
  st.xBottomCenter = 30.55;
  st.yBottomCenter = 40.21;
  st.angle = -Math.PI / 7;

  let it = st.loopIterator();
  let ur = it.next().value;

  checkCoords(
    baseCoordinatesHairpin(ur),
    [
      [31.766658011738794, 37.88502123742436],
      [32.39273339390459, 37.237976781813956],
      [33.24712551629532, 36.953985562078394],
      [34.13596999150318, 37.097486121598884],
      [34.85758507976117, 37.63591771065049],
      [35.248233940146754, 38.447108427787754],
      [35.21927705922634, 39.34699642678407],
      [34.777284848680665, 40.131394155941386],
      [34.02254679724785, 40.62231918627659],
      [33.12631545532006, 40.70837901102969],
    ],
  );
});

it('one base pair stem', () => {
  let partners = [6, null, null, null, null, 1];
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 0.9;
  let bps = defaultBaseProps(partners.length);

  let st = new Stem(1, partners, gps, bps);
  st.xBottomCenter = -10.35;
  st.yBottomCenter = 8.64;
  st.angle = 4 * Math.PI / 3;

  let it = st.loopIterator();
  let ur = it.next().value;

  checkCoords(
    baseCoordinatesHairpin(ur),
    [
      [-11.807052976776538, 8.003465414209254],
      [-11.602123703761109, 7.251066185281108],
      [-10.926790115841237, 6.861162156502774],
      [-10.172728633293925, 7.059887814556406],
    ],
  );
});

it('large base pair bond length', () => {
  let partners = [8, 7, null, null, null, null, 2, 1];
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 50;
  let bps = defaultBaseProps(partners.length);

  let st = new Stem(1, partners, gps, bps);
  st.xBottomCenter = 1.34;
  st.yBottomCenter = 2.87;
  st.angle = Math.PI / 6;

  let it = st.loopIterator();
  let ur = it.next().value;

  checkCoords(
    baseCoordinatesHairpin(ur),
    [
      [11.180336097554573, -9.117996055239473],
      [6.091766353520143, -0.27634236223457265],
      [0.9910707620601897, 8.558321556115061],
      [-4.1217410755289166, 17.38597906988116],
    ],
  );
});

it('large base pair bond length with one base hairpin', () => {
  let partners = [3, null, 1];
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 50;
  let bps = defaultBaseProps(partners.length);

  let st = new Stem(1, partners, gps, bps);
  st.xBottomCenter = 1.34;
  st.yBottomCenter = 2.87;
  st.angle = Math.PI / 6;

  let it = st.loopIterator();
  let ur = it.next().value;

  checkCoords(
    baseCoordinatesHairpin(ur),
    [
      [2.676908285387981, 3.6418643584506754],
    ],
  );
});

/*
let coords = baseCoordinatesHairpin(ur);
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
