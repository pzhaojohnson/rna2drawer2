import areSameTertiaryBond from './areSameTertiaryBond';
import NodeSVG from '../../NodeSVG';
import Drawing from '../../Drawing';

let drawing = new Drawing();
drawing.addTo(document.body, () => NodeSVG());
let seq = drawing.appendSequenceOutOfView('asdf', 'asdf');
let b1 = seq.getBaseAtPosition(1);
let b2 = seq.getBaseAtPosition(2);

it('returns false for missing tertiary bonds', () => {
  let tb = drawing.addTertiaryBond(b1, b2);
  expect(areSameTertiaryBond(undefined, tb)).toBeFalsy();
  expect(areSameTertiaryBond(null, tb)).toBeFalsy();
  expect(areSameTertiaryBond(tb, undefined)).toBeFalsy();
  expect(areSameTertiaryBond(tb, null)).toBeFalsy();
});

it('returns false for removed tertiary bonds', () => {
  let tb1 = drawing.addTertiaryBond(b1, b2);
  let tb2 = drawing.addTertiaryBond(b1, b2);
  tb1.remove();
  expect(tb1.hasBeenRemoved()).toBeTruthy();
  expect(tb2.hasBeenRemoved()).toBeFalsy();
  expect(areSameTertiaryBond(tb1, tb2)).toBeFalsy();
  expect(areSameTertiaryBond(tb2, tb1)).toBeFalsy();
});

it('returns true if IDs match', () => {
  let tb = drawing.addTertiaryBond(b1, b2);
  expect(areSameTertiaryBond(tb, tb)).toBeTruthy();
});

it('returns false if IDs do not match', () => {
  let tb1 = drawing.addTertiaryBond(b1, b2);
  let tb2 = drawing.addTertiaryBond(b1, b2);
  expect(areSameTertiaryBond(tb1, tb2)).toBeFalsy();
});
