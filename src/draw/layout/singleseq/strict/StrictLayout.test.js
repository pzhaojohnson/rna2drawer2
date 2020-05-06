import StrictLayout from './StrictLayout';
import parseDotBracket from '../../../../parse/parseDotBracket';
import GeneralStrictLayoutProps from './GeneralStrictLayoutProps';
import StrictLayoutPerBaseProps from './StrictLayoutPerBaseProps';
import Stem from './Stem';
import { StemLayout } from './StemLayout';

function defaultPerBaseProps(length) {
  let pbps = [];
  for (let i = 0; i < length; i++) {
    pbps.push(new StrictLayoutPerBaseProps());
  }
  return pbps;
}

it('basic test of constructor', () => {
  let partners = parseDotBracket('..((((......)))).').secondaryPartners;
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(partners.length);
  expect(() => { new StrictLayout(partners, gps, pbps) }).not.toThrow();
});

it('sequence of length zero', () => {
  let partners = [];
  let gps = new GeneralStrictLayoutProps();
  let pbps = [];
  expect(() => { new StrictLayout(partners, gps, pbps) }).not.toThrow();
});

it('_validatePartners - throws when there are knots', () => {
  let partners = parseDotBracket('.....(((.....)))').secondaryPartners;
  partners[0] = 12;
  partners[11] = 1;
  partners[1] = 11;
  partners[10] = 2;
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(partners.length);
  expect(() => { new StrictLayout(partners, gps, pbps) }).toThrow();
});

it('_validatePatners - does not throw when there are no knots', () => {
  let partners = parseDotBracket('.....(((.....)))').secondaryPartners;
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(partners.length);
  expect(() => { new StrictLayout(partners, gps, pbps) }).not.toThrow();
});

it('size', () => {
  let partners = parseDotBracket('...').secondaryPartners;
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(partners.length);
  let sl = new StrictLayout(partners, gps, pbps);
  expect(sl.size).toBe(3);
});

it('isEmpty - sequence of length zero', () => {
  let partners = [];
  let gps = new GeneralStrictLayoutProps();
  let pbps = [];
  let sl = new StrictLayout(partners, gps, pbps);
  expect(sl.isEmpty()).toBeTruthy();
});

it('isEmpty - sequence of length greater than zero', () => {
  let partners = parseDotBracket('.').secondaryPartners;
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(partners.length);
  let sl = new StrictLayout(partners, gps, pbps);
  expect(sl.isEmpty()).toBeFalsy();
});

it('baseCoordinatesAtPosition', () => {
  let partners = parseDotBracket('...(((...(((......))).......))).').secondaryPartners;
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(partners.length);
  let sl = new StrictLayout(partners, gps, pbps);
  let st = new Stem(0, partners, gps, pbps);
  StemLayout.setCoordinatesAndAngles(st, gps, pbps);
  let ebcs = st.baseCoordinates();
  for (let p = 1; p <= partners.length; p++) {
    let bc = sl.baseCoordinatesAtPosition(p);
    let ebc = ebcs[p - 1];
    expect(bc.xCenter).toBe(ebc.xCenter);
    expect(bc.yCenter).toBe(ebc.yCenter);
  }
});

it('xMin, xMax, yMin, and yMax - sequence of length zero', () => {
  let partners = [];
  let gps = new GeneralStrictLayoutProps();
  let pbps = [];
  let sl = new StrictLayout(partners, gps, pbps);
  expect(sl.xMin).toBe(0);
  expect(sl.xMax).toBe(0);
  expect(sl.yMin).toBe(0);
  expect(sl.yMax).toBe(0);
});

it('xMin, xMax, yMin, and yMax - sequence of length greater than zero', () => {
  let partners = parseDotBracket('..(((......(((.....)))..........)))').secondaryPartners;
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(partners.length);
  let sl = new StrictLayout(partners, gps, pbps);
  for (let p = 1; p <= partners.length; p++) {
    let bc = sl.baseCoordinatesAtPosition(p);
    expect(sl.xMin).toBeLessThanOrEqual(bc.xLeft);
    expect(sl.xMax).toBeGreaterThanOrEqual(bc.xRight);
    expect(sl.yMin).toBeLessThanOrEqual(bc.yBottom);
    expect(sl.yMax).toBeGreaterThanOrEqual(bc.yTop);
  }
});

it('xCenter and yCenter', () => {
  let partners = parseDotBracket('..(((......(((.....)))..........)))').secondaryPartners;
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(partners.length);
  let sl = new StrictLayout(partners, gps, pbps);
  expect(sl.xCenter).toBe((sl.xMin + sl.xMax) / 2);
  expect(sl.yCenter).toBe((sl.yMin + sl.yMax) / 2);
});

it('width and height', () => {
  let partners = parseDotBracket('..(((......(((.....)))..........)))').secondaryPartners;
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(partners.length);
  let sl = new StrictLayout(partners, gps, pbps);
  expect(sl.width).toBe(sl.xMax - sl.xMin);
  expect(sl.height).toBe(sl.yMax - sl.yMin);
});
