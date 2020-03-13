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
      [11.194460, 12.568865],
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
      [-0.464747, -1.343542],
      [0.351069, -1.718597],
      [1.128672, -1.269647],
      [1.211774, -0.375602],
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
      [31.298275848109274, 37.4383211144659],
      [31.99381020262823, 36.64626486355541],
      [32.98139276917977, 36.2777518825548],
      [34.02577071159992, 36.42056594456809],
      [34.87816192163483, 37.04068719720962],
      [35.33551760470911, 37.99039605895734],
      [35.288890696320976, 39.043461619279505],
      [34.74938822975693, 39.94903228548607],
      [33.84552552077415, 40.4913913420462],
      [32.79261243104177, 40.54134300260604],
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
      [-11.666620872337607, 7.90202373874725],
      [-11.47676277815211, 7.055724121754207],
      [-10.725629066195483, 6.622056870958646],
      [-9.89778305157372, 6.880784746776429],
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
