import removeTertiaryBondFromDrawing from './removeTertiaryBondFromDrawing';
import NodeSVG from '../../NodeSVG';
import Drawing from '../../Drawing';

let drawing = new Drawing();
drawing.addTo(document.body, () => NodeSVG());
let seq = drawing.appendSequenceOutOfView('asdf', 'asdf');
let b1 = seq.getBaseAtPosition(1);
let b2 = seq.getBaseAtPosition(2);

it('returns early on missing tertiary bond', () => {
  expect(
    () => removeTertiaryBondFromDrawing(undefined, drawing)
  ).not.toThrow();
  expect(
    () => removeTertiaryBondFromDrawing(null, drawing)
  ).not.toThrow();
});

it('returns early on missing drawing', () => {
  let tb = drawing.addTertiaryBond(b1, b2);
  expect(
    () => removeTertiaryBondFromDrawing(tb, undefined)
  ).not.toThrow();
  expect(
    () => removeTertiaryBondFromDrawing(tb, null)
  ).not.toThrow();
});

it('returns early on already removed tertiary bond', () => {
  let tb = drawing.addTertiaryBond(b1, b2);
  tb.remove();
  expect(tb.hasBeenRemoved()).toBeTruthy();
  expect(
    () => removeTertiaryBondFromDrawing(tb, drawing)
  ).not.toThrow();
});

it('removes tertiary bond', () => {
  let tb = drawing.addTertiaryBond(b1, b2);
  let id = tb.id;
  expect(tb.hasBeenRemoved()).toBeFalsy();
  expect(drawing.getTertiaryBondById(id)).toBeTruthy();
  removeTertiaryBondFromDrawing(tb, drawing);
  expect(tb.hasBeenRemoved()).toBeTruthy();
  expect(drawing.getTertiaryBondById(id)).toBeFalsy();
});
