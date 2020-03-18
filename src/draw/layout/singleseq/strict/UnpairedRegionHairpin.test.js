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
      [11.194460181615776, 12.56886572217647]
    ],
  );
});

it('four base hairpin', () => {
  let partners = [8, 7, null, null, null, null, 2, 1];
  let gps = new StrictLayoutBaseProps();
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
      [-0.42086917610115415, -1.2048001895397196],
      [0.2948427027781855, -1.4959914199012037],
      [0.9640040208893879, -1.1096509527584162],
      [1.0696809574767658, -0.3442306686778752],
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
      [31.316173577787588, 37.60196310698314],
      [31.942248959953393, 36.954918651372736],
      [32.796641082344124, 36.67092743163718],
      [33.68548555755198, 36.81442799115767],
      [34.40710064580996, 37.352859580209284],
      [34.797749506195544, 38.16405029734655],
      [34.76879262527513, 39.06393829634286],
      [34.32680041472945, 39.84833602550018],
      [33.57206236329663, 40.33926105583539],
      [32.675831021368836, 40.42532088058848],
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
      [-11.557052976776538, 7.936478116101472],
      [-11.352123703761107, 7.184078887173326],
      [-10.676790115841237, 6.794174858394992],
      [-9.922728633293925, 6.992900516448626],
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
      [10.248632612406254, -10.156469060840209],
      [5.186127558896942, -1.2994310073668203],
      [0.08524330963473403, 7.535559675882951],
      [-5.053924120203874, 16.348336685745835],
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
      [1.7744514459120637, 2.6208306592473036],
    ],
  )
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
