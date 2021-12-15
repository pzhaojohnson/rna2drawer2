import basesInRange from './basesInRange';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { StrictDrawing } from 'Draw/strict/StrictDrawing';
import FoldingMode from './FoldingMode';
import IntegerRange from './IntegerRange';

let sd = new StrictDrawing({ SVG: { SVG: NodeSVG } });
sd.appendTo(document.body);
let mode = new FoldingMode(sd);
sd.appendSequence('asdf', 'asdf');
sd.appendSequence('qwer', 'qwerqwer');

it('a range spanning multiple sequences', () => {
  let bases = basesInRange(mode, new IntegerRange(3, 7));
  expect(bases.length).toBe(5);
  let characters = '';
  bases.forEach(b => characters += b.character);
  expect(characters).toBe('dfqwe');
});

it('a range of size one', () => {
  let bases = basesInRange(mode, new IntegerRange(2, 2));
  expect(bases.length).toBe(1);
  expect(bases[0].character).toBe('s');
});

it('an invalid range', () => {
  let bases = basesInRange(mode, new IntegerRange(6, 2));
  expect(bases.length).toBe(0);
});

it('does not return undefineds', () => {
  let bases = basesInRange(mode, new IntegerRange(100, 200));
  expect(bases.length).toBe(0);
});
