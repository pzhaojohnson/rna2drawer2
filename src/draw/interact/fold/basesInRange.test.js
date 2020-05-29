import basesInRange from './basesInRange';
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
  let mode = new FoldingMode(sd);
  let bases = basesInRange(mode, {
    position5: 2,
    position3: 6,
  });
  expect(bases.length).toBe(5);
  expect(bases[0].character).toBe('s');
  expect(bases[1].character).toBe('d');
  expect(bases[2].character).toBe('f');
  expect(bases[3].character).toBe('q');
  expect(bases[4].character).toBe('w');
});

it('handles positions out of range', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => NodeSVG());
  sd.appendSequence('asdf', 'asdf');
  let mode = new FoldingMode(sd);
  let bases = basesInRange(mode, {
    position5: -1,
    position3: 6,
  });
  expect(bases.length).toBe(4);
  expect(bases[0].character).toBe('a');
  expect(bases[1].character).toBe('s');
  expect(bases[2].character).toBe('d');
  expect(bases[3].character).toBe('f');
});

it('handles invalid range', () => {
  let bases = basesInRange(mode, {
    position5: 4,
    position3: 2,
  });
  expect(bases.length).toBe(0);
});
