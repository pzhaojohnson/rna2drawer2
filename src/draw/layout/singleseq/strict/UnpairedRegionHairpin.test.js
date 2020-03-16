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
      [-0.4079121930151395, -1.1608436083391593],
      [0.2767355591047758, -1.4262325754710479],
      [0.9126446613109304, -1.0590902841321916],
      [1.0251349499505598, -0.3334734545864898],
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
      [31.31692635624798, 37.6094137895801],
      [31.939815412111138, 36.96892716355293],
      [32.7881709930036, 36.68873668833583],
      [33.669996769348664, 36.832253914504605],
      [34.38572157523705, 37.36699861646041],
      [34.77336553004723, 38.171949582875676],
      [34.745198655710524, 39.064933637169965],
      [34.307595562838436, 39.843854318075635],
      [33.559592775189635, 40.33242951566899],
      [32.67047519284178, 40.42008691007273],
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
      [-11.29484762593718, 8.040797534016814],
      [-11.055919610744949, 7.504460458809705],
      [-10.547433582407827, 7.210885913470103],
      [-9.963488042690908, 7.2721367202413925],
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
