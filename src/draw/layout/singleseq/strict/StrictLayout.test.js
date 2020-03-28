import StrictLayout from './StrictLayout';
import parseDotBracket from '../../../../parse/parseDotBracket';
import StrictLayoutGeneralProps from './StrictLayoutGeneralProps';
import StrictLayoutBaseProps from './StrictLayoutBaseProps';
import Stem from './Stem';
import { StemLayout } from './StemLayout';

function defaultBaseProps(length) {
  let bps = [];
  for (let i = 0; i < length; i++) {
    bps.push(new StrictLayoutBaseProps());
  }
  return bps;
}

it('basic test of constructor', () => {
  let partners = parseDotBracket('..((((......)))).').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  expect(() => { new StrictLayout(partners, gps, bps) }).not.toThrow();
});

it('sequence of length zero', () => {
  let partners = [];
  let gps = new StrictLayoutGeneralProps();
  let bps = [];
  expect(() => { new StrictLayout(partners, gps, bps) }).not.toThrow();
});

it('_validatePartners - throws when there are knots', () => {
  let partners = parseDotBracket('.....(((.....)))').secondaryPartners;
  partners[0] = 12;
  partners[11] = 1;
  partners[1] = 11;
  partners[10] = 2;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  expect(() => { new StrictLayout(partners, gps, bps) }).toThrow();
});

it('_validatePatners - does not throw when there are no knots', () => {
  let partners = parseDotBracket('.....(((.....)))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  expect(() => { new StrictLayout(partners, gps, bps) }).not.toThrow();
});

it('size', () => {
  let partners = parseDotBracket('...').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  let sl = new StrictLayout(partners, gps, bps);
  expect(sl.size).toBe(3);
});

it('isEmpty - sequence of length zero', () => {
  let partners = [];
  let gps = new StrictLayoutGeneralProps();
  let bps = [];
  let sl = new StrictLayout(partners, gps, bps);
  expect(sl.isEmpty()).toBeTruthy();
});

it('isEmpty - sequence of length greater than zero', () => {
  let partners = parseDotBracket('.').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  let sl = new StrictLayout(partners, gps, bps);
  expect(sl.isEmpty()).toBeFalsy();
});

it('baseCoordinates', () => {
  let partners = parseDotBracket('...(((...(((......))).......))).').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  let sl = new StrictLayout(partners, gps, bps);
  let st = new Stem(0, partners, gps, bps);
  StemLayout.setCoordinatesAndAngles(st, gps, bps);
  let ebcs = st.baseCoordinates();
  for (let p = 1; p <= partners.length; p++) {
    let bc = sl.baseCoordinates(p);
    let ebc = ebcs[p - 1];
    expect(bc.xCenter).toBe(ebc.xCenter);
    expect(bc.yCenter).toBe(ebc.yCenter);
  }
});

it('xMin, xMax, yMin, and yMax - sequence of length zero', () => {
  let partners = [];
  let gps = new StrictLayoutGeneralProps();
  let bps = [];
  let sl = new StrictLayout(partners, gps, bps);
  expect(sl.xMin).toBe(0);
  expect(sl.xMax).toBe(0);
  expect(sl.yMin).toBe(0);
  expect(sl.yMax).toBe(0);
});

it('xMin, xMax, yMin, and yMax - sequence of length greater than zero', () => {
  let partners = parseDotBracket('..(((......(((.....)))..........)))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  let sl = new StrictLayout(partners, gps, bps);
  for (let p = 1; p <= partners.length; p++) {
    let bc = sl.baseCoordinates(p);
    expect(sl.xMin).toBeLessThanOrEqual(bc.xLeft);
    expect(sl.xMax).toBeGreaterThanOrEqual(bc.xRight);
    expect(sl.yMin).toBeLessThanOrEqual(bc.yBottom);
    expect(sl.yMax).toBeGreaterThanOrEqual(bc.yTop);
  }
});

it('xCenter and yCenter', () => {
  let partners = parseDotBracket('..(((......(((.....)))..........)))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  let sl = new StrictLayout(partners, gps, bps);
  expect(sl.xCenter).toBe((sl.xMin + sl.xMax) / 2);
  expect(sl.yCenter).toBe((sl.yMin + sl.yMax) / 2);
});

it('width and height', () => {
  let partners = parseDotBracket('..(((......(((.....)))..........)))').secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(partners.length);
  let sl = new StrictLayout(partners, gps, bps);
  expect(sl.width).toBe(sl.xMax - sl.xMin);
  expect(sl.height).toBe(sl.yMax - sl.yMin);
});
