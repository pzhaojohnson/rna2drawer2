import isPairable from './isPairable';
import StrictDrawing from '../../StrictDrawing';
import NodeSVG from '../../NodeSVG';
import FoldingMode from './FoldingMode';
import IntegerRange from './IntegerRange';
import { selectedCharacters } from './selected';
import charactersInRange from './charactersInRange';

let sd = new StrictDrawing();
sd.addTo(document.body, () => NodeSVG());
let mode = new FoldingMode(sd);
sd.appendSequence('asdf', 'AAAAUUUUGGGGCCCCUUUU');

it('nothing selected', () => {
  mode.selected = undefined;
  let r = new IntegerRange(5, 8);
  expect(isPairable(mode, r)).toBeFalsy();
});

it('overlaps with selected', () => {
  mode.selected = { tightEnd: 8, looseEnd: 10 };
  let r = new IntegerRange(7, 9);
  expect(selectedCharacters(mode)).toBe('UGG');
  expect(charactersInRange(mode, r)).toBe('UUG');
  expect(isPairable(mode, r)).toBeFalsy();
});

it('is not complementary', () => {
  mode.selected = { tightEnd: 1, looseEnd: 4 };
  let r = new IntegerRange(13, 16);
  expect(isPairable(mode, r)).toBeFalsy();
});

it('is complementary', () => {
  mode.selected = { tightEnd: 17, looseEnd: 20 };
  let r = new IntegerRange(9, 12);
  expect(isPairable(mode, r)).toBeTruthy();
});
