import charactersInRange from './charactersInRange';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { StrictDrawing } from 'Draw/strict/StrictDrawing';
import FoldingMode from './FoldingMode';
import IntegerRange from './IntegerRange';

let sd = new StrictDrawing({ SVG: { SVG: NodeSVG } });
sd.appendTo(document.body);
let mode = new FoldingMode(sd);
sd.appendSequence('zxcv', 'zxcvzxcv');
sd.appendSequence('qwer', 'qwerqw');

it('a range spanning multiple sequences', () => {
  let cs = charactersInRange(mode, new IntegerRange(6, 10));
  expect(cs).toBe('xcvqw');
});

it('a range of size one', () => {
  let cs = charactersInRange(mode, new IntegerRange(11, 11));
  expect(cs).toBe('e');
});

it('an invalid range', () => {
  let cs = charactersInRange(mode, new IntegerRange(10, 8));
  expect(cs).toBe('');
});
