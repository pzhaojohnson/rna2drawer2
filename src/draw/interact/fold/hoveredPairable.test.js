import hoveredPairable from './hoveredPairable';
import StrictDrawing from '../../StrictDrawing';
import NodeSVG from '../../NodeSVG';
import FoldingMode from './FoldingMode';
import { selectedCharacters } from './selected';
import charactersInRange from './charactersInRange';
import IntegerRange from './IntegerRange';

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

it('no hovered complements', () => {
  mode.hovered = 6;
  mode.selected = { tightEnd: 9, looseEnd: 12 };
  expect(hoveredPairable(mode)).toBeFalsy();
});

it("returns the 3' most hovered complement", () => {
  mode.hovered = 4;
  mode.selected = { tightEnd: 13, looseEnd: 16 };
  let c = hoveredPairable(mode);
  expect(c.start).toBe(4);
  expect(c.end).toBe(7);
});

it('does not return a complement that overlaps with selected', () => {
  mode.hovered = 25;
  mode.selected = { tightEnd: 26, looseEnd: 28 };
  expect(selectedCharacters(mode)).toBe('ugg');
  expect(charactersInRange(mode, new IntegerRange(25, 27))).toBe('uug');
  expect(hoveredPairable(mode)).toBeFalsy();
});
