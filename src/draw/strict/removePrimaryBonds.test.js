import { StrictDrawing } from 'Draw/strict/StrictDrawing';
import * as SVG from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';

import { removePrimaryBonds } from './removePrimaryBonds';

let container = null;
let strictDrawing = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  strictDrawing = new StrictDrawing({ SVG });
  strictDrawing.appendTo(container);
});

afterEach(() => {
  strictDrawing = null;

  container.remove();
  container = null;
});

describe('removePrimaryBonds function', () => {
  test('an empty primary bonds array', () => {
    appendSequence(strictDrawing.drawing, { id: 'asdf', characters: 'asdfQWER' });
    expect(strictDrawing.drawing.primaryBonds.length).toBe(7);
    removePrimaryBonds(strictDrawing, []);
    expect(strictDrawing.drawing.primaryBonds.length).toBe(7); // didn't change
  });

  test('removing one primary bond', () => {
    appendSequence(strictDrawing.drawing, { id: '1', characters: '1234' });
    expect(strictDrawing.drawing.primaryBonds.length).toBe(3);
    let pb = strictDrawing.drawing.primaryBonds[1];
    expect(strictDrawing.drawing.primaryBonds.includes(pb)).toBeTruthy();
    removePrimaryBonds(strictDrawing, [pb]);
    expect(strictDrawing.drawing.primaryBonds.length).toBe(2);
    expect(strictDrawing.drawing.primaryBonds.includes(pb)).toBeFalsy();
  });

  test('removing multiple primary bonds', () => {
    appendSequence(strictDrawing.drawing, { id: 'zz', characters: 'zxcvZXCVqwer' });
    expect(strictDrawing.drawing.primaryBonds.length).toBe(11);
    let pbs = [
      strictDrawing.drawing.primaryBonds[3],
      strictDrawing.drawing.primaryBonds[5],
      strictDrawing.drawing.primaryBonds[9],
      strictDrawing.drawing.primaryBonds[10],
    ];
    expect(pbs.every(pb => strictDrawing.drawing.primaryBonds.includes(pb))).toBeTruthy();
    removePrimaryBonds(strictDrawing, pbs);
    expect(strictDrawing.drawing.primaryBonds.length).toBe(7);
    expect(pbs.every(pb => !strictDrawing.drawing.primaryBonds.includes(pb))).toBeTruthy();
  });

  test('when a primary bond has already been removed', () => {
    appendSequence(strictDrawing.drawing, { id: '2', characters: '12345678' });
    let pb = strictDrawing.drawing.primaryBonds[3];
    removePrimaryBonds(strictDrawing, [pb]);
    expect(strictDrawing.drawing.primaryBonds.length).toBe(6);
    expect(strictDrawing.drawing.primaryBonds.includes(pb)).toBeFalsy();
    removePrimaryBonds(strictDrawing, [pb]); // try removing again
    expect(strictDrawing.drawing.primaryBonds.length).toBe(6); // no change
    expect(strictDrawing.drawing.primaryBonds.includes(pb)).toBeFalsy();
  });
});
