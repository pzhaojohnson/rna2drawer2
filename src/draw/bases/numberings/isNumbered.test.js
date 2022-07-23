import { Drawing } from 'Draw/Drawing';
import * as SVG from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { addNumbering } from 'Draw/bases/numberings/add';
import { removeNumbering } from 'Draw/bases/numberings/add';

import { isNumbered } from './isNumbered';

let container = null;

let drawing = null;
let sequence = null;
let base = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing({ SVG });
  drawing.appendTo(container);

  sequence = appendSequence(drawing, { id: 'asdf', characters: 'asdfASDF' });
  base = sequence.atPosition(5);
});

afterEach(() => {
  base = null;
  sequence = null;
  drawing = null;

  container.remove();
  container = null;
});

test('isNumbered function', () => {
  addNumbering(base, 10);
  expect(base.numbering).toBeTruthy();
  expect(isNumbered(base)).toBe(true);
  removeNumbering(base);
  expect(base.numbering).toBeFalsy();
  expect(isNumbered(base)).toBe(false);
});
