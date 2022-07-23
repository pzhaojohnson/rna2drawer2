import { Drawing } from 'Draw/Drawing';
import * as SVG from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { addNumbering } from 'Draw/bases/numberings/add';
import { removeNumbering } from 'Draw/bases/numberings/add';

import { areAllUnnumbered } from './areAllUnnumbered';

let container = null;
let drawing = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing({ SVG });
  drawing.appendTo(container);
});

afterEach(() => {
  drawing.clear();
  drawing = null;

  container.remove();
  container = null;
});

test('areAllUnnumbered function', () => {
  let seq = appendSequence(drawing, { id: 'asdf', characters: 'asdfASDFqwerQWER' });

  // remove any numberings that were added automatically
  seq.bases.forEach(b => removeNumbering(b));

  addNumbering(seq.atPosition(2), 2);
  addNumbering(seq.atPosition(3), 4);
  addNumbering(seq.atPosition(8), -2);
  addNumbering(seq.atPosition(10), 12);
  addNumbering(seq.atPosition(16), 15);

  // an empty array
  expect(areAllUnnumbered([])).toBeTruthy();

  // one base
  expect(areAllUnnumbered([seq.atPosition(1)])).toBeTruthy();
  expect(areAllUnnumbered([seq.atPosition(2)])).toBeFalsy();

  // multiple unnumbered bases
  expect(areAllUnnumbered([
    seq.atPosition(1),
    seq.atPosition(4),
    seq.atPosition(5),
    seq.atPosition(9),
    seq.atPosition(12),
    seq.atPosition(15),
  ])).toBeTruthy();

  // multiple numbered bases
  expect(areAllUnnumbered([
    seq.atPosition(2),
    seq.atPosition(3),
    seq.atPosition(8),
    seq.atPosition(16),
  ])).toBeFalsy();

  // multiple bases (only some numbered)
  expect(areAllUnnumbered([
    seq.atPosition(1),
    seq.atPosition(4),
    seq.atPosition(8),
    seq.atPosition(9),
    seq.atPosition(14),
  ])).toBeFalsy();
});
