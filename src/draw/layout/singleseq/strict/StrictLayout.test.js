import StrictLayout from './StrictLayout';
import parseDotBracket from '../../../../parse/parseDotBracket';
import GeneralStrictLayoutProps from './GeneralStrictLayoutProps';
import PerBaseStrictLayoutProps from './PerBaseStrictLayoutProps';
import Stem from './Stem';
import { StemLayout } from './StemLayout';

function defaultPerBaseProps(length) {
  let pbps = [];
  for (let i = 0; i < length; i++) {
    pbps.push(new PerBaseStrictLayoutProps());
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

it('handles undefineds in partners notation', () => {
  let partners = parseDotBracket('..((....))..').secondaryPartners;
  partners[0] = undefined;
  partners[5] = undefined;
  expect(
    () => new StrictLayout(partners)
  ).not.toThrow();
});

it('handles knots', () => {
  let partners = parseDotBracket('...((....))').secondaryPartners;
  partners[0] = 8;
  partners[1] = 7;
  partners[6] = 2;
  partners[7] = 1;
  expect(
    () => new StrictLayout(partners)
  ).not.toThrow();
});

it('handles missing general and per base props', () => {
  let partners = parseDotBracket('....').secondaryPartners;
  expect(() => new StrictLayout(partners)).not.toThrow();
});

it('handles per base props of wrong length', () => {
  let partners = parseDotBracket('...((..))').secondaryPartners;
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(3); // too short
  expect(
    () => new StrictLayout(partners, gps, pbps)
  ).not.toThrow();
  pbps = defaultPerBaseProps(20); // too long
  expect(
    () => new StrictLayout(partners, gps, pbps)
  ).not.toThrow();
});

it('handles nullish values in per base props', () => {
  let partners = parseDotBracket('..(((...)))').secondaryPartners;
  let gps = new GeneralStrictLayoutProps();
  let pbps = defaultPerBaseProps(8);
  pbps[1] = undefined;
  pbps[2] = null;
  pbps[5] = undefined;
  expect(
    () => new StrictLayout(partners, gps, pbps)
  ).not.toThrow();
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
