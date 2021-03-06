import charactersInRange from './charactersInRange';
import NodeSVG from '../../NodeSVG';
import StrictDrawing from '../../StrictDrawing';
import FoldingMode from './FoldingMode';
import IntegerRange from './IntegerRange';

let sd = new StrictDrawing();
sd.addTo(document.body, () => NodeSVG());
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
