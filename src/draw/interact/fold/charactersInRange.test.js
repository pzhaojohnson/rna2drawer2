import charactersInRange from './charactersInRange';
import NodeSVG from '../../NodeSVG';
import StrictDrawing from '../../StrictDrawing';
import FoldingMode from './FoldingMode';

let sd = new StrictDrawing();
sd.addTo(document.body, () => NodeSVG());
let mode = new FoldingMode(sd);

it('handles multiple sequences', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => NodeSVG());
  sd.appendSequence('asdf', 'asdf');
  sd.appendSequence('qwer', 'qwer');
  sd.appendSequence('zxcv', 'zxcv');
  let mode = new FoldingMode(sd);
  let cs = charactersInRange(mode, {
    position5: 4,
    position3: 10,
  });
  expect(cs).toBe('fqwerzx');
});

it('handles invalid range', () => {
  let cs = charactersInRange(mode, {
    position5: 4,
    position3: 3,
  });
  expect(cs.length).toBe(0);
});
