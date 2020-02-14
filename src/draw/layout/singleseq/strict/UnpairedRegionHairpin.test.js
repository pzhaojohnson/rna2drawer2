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
  let bps = defaultBaseProps(partners.length);

  let st = new Stem(1, partners, gps, bps);
  st.xBottomCenter = 10;
  st.yBottomCenter = 11;
  st.angle = Math.PI / 2;

  let it = st.loopIterator();
  let ur = it.next().value;

  let coords = baseCoordinatesHairpin(ur);
  expect(coords.length).toBe(1);
  
  let vbc = coords[0];
});

it('four base hairpin', () => {});

it('big hairpin', () => {});

it('one base pair stem', () => {});

/**
 * A large Watson-Crick bond length causes the Math.asin operation used
 * to calculate the center of the hairpin loop to return NaN.
 */
it('large Watson-Crick bond length', () => {});
