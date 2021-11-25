import hoveredPairable from './hoveredPairable';
import { StrictDrawing } from 'Draw/strict/StrictDrawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import FoldingMode from './FoldingMode';

let sd = new StrictDrawing();
sd.addTo(document.body, () => NodeSVG());
let mode = new FoldingMode(sd);
sd.appendSequence('asdf', 'ggggaaaacccc');
sd.appendSequence('qwer', 'uuuuggggaaaa');
sd.appendSequence('zxcv', 'uugg');

it('nothing hovered', () => {
  mode.hovered = undefined;
  mode.selected = { tightEnd: 8, looseEnd: 12 };
  expect(hoveredPairable(mode)).toBeFalsy();
});

it('nothing selected', () => {
  mode.hovered = 10;
  mode.selected = undefined;
  expect(hoveredPairable(mode)).toBeFalsy();
});

it('no hovered pairable', () => {
  mode.hovered = 6;
  mode.selected = { tightEnd: 9, looseEnd: 12 };
  expect(hoveredPairable(mode)).toBeFalsy();
});

it("returns the 3' most hovered pairable", () => {
  mode.hovered = 4;
  mode.selected = { tightEnd: 13, looseEnd: 16 };
  let hp = hoveredPairable(mode);
  expect(hp.start).toBe(4);
  expect(hp.end).toBe(7);
});

it("hovering the 5' most end of a pairable", () => {
  mode.hovered = 9;
  mode.selected = { tightEnd: 17, looseEnd: 20 };
  let hp = hoveredPairable(mode);
  expect(hp.start).toBe(9);
  expect(hp.end).toBe(12);
});

it("hovering the 3' most end of a pairable", () => {
  mode.hovered = 16;
  mode.selected = { tightEnd: 5, looseEnd: 8 };
  let hp = hoveredPairable(mode);
  expect(hp.start).toBe(13);
  expect(hp.end).toBe(16);
});
