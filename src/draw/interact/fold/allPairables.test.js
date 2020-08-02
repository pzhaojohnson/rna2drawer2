import allPairables from './allPairables';
import StrictDrawing from '../../StrictDrawing';
import NodeSVG from '../../NodeSVG';
import FoldingMode from './FoldingMode';
import { selectedCharacters } from './selected';

let sd = new StrictDrawing();
sd.addTo(document.body, () => NodeSVG());
let mode = new FoldingMode(sd);
sd.appendSequence('asdf', 'ggggaaaagguu');
sd.appendSequence('qwer', 'uuccccccgggg');

it('returns an empty list when nothing selected', () => {
  mode.selected = undefined;
  expect(allPairables(mode).length).toBe(0);
});

it('handles multiple sequences', () => {
  mode.selected = { tightEnd: 5, looseEnd: 8 };
  let ps = allPairables(mode);
  expect(ps.length).toBe(1);
  // spans two sequences
  expect(ps[0].start).toBe(11);
  expect(ps[0].end).toBe(14);
});

it("can find pairables at the 5' and 3' ends", () => {
  mode.selected = { tightEnd: 17, looseEnd: 20 };
  let ps = allPairables(mode);
  expect(ps.length).toBe(2);
  expect(ps[0].start).toBe(1);
  expect(ps[0].end).toBe(4);
  expect(ps[1].start).toBe(21);
  expect(ps[1].end).toBe(24);
});

it('does not return pairables that overlap with selected', () => {
  mode.selected = { tightEnd: 9, looseEnd: 12 };
  expect(selectedCharacters(mode)).toBe('gguu');
  expect(allPairables(mode).length).toBe(0);
});
