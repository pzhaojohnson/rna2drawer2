import dragTertiaryBond from './dragTertiaryBond';
import NodeSVG from '../../NodeSVG';
import Drawing from '../../Drawing';

let drawing = new Drawing();
drawing.addTo(document.body, () => NodeSVG());
let seq = drawing.appendSequenceOutOfView('asdf', 'asdf');
let b1 = seq.getBaseAtPosition(1);
let b2 = seq.getBaseAtPosition(2);

it('returns early for missing tertiary bond', () => {
  expect(
    () => dragTertiaryBond(undefined, 1, 2)
  ).not.toThrow();
  expect(
    () => dragTertiaryBond(null, 5, 10)
  ).not.toThrow();
});

it('returns early for removed tertiary bond', () => {
  let tb = drawing.addTertiaryBond(b1, b2);
  tb.remove();
  expect(tb.hasBeenRemoved()).toBeTruthy();
  expect(
    () => dragTertiaryBond(tb, 5, 20)
  ).not.toThrow();
});

it('returns early for nonfinite x and y moves', () => {
  let tb = drawing.addTertiaryBond(b1, b2);
  expect(Number.isFinite(tb.xControl)).toBeTruthy();
  expect(Number.isFinite(tb.yControl)).toBeTruthy();
  dragTertiaryBond(tb, NaN, 5);
  dragTertiaryBond(tb, 1, NaN);
  expect(Number.isFinite(tb.xControl)).toBeTruthy();
  expect(Number.isFinite(tb.yControl)).toBeTruthy();
});

it('drags tertiary bond by x and y moves', () => {
  let tb = drawing.addTertiaryBond(b1, b2);
  let xControl = tb.xControl;
  let yControl = tb.yControl;
  dragTertiaryBond(tb, 12.5, -37.3);
  expect(tb.xControl).toBeCloseTo(xControl + 25);
  expect(tb.yControl).toBeCloseTo(yControl - 74.6);
});
