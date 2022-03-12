import { StrictDrawing } from 'Draw/strict/StrictDrawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { removeBases } from 'Draw/sequences/remove/bases';

import { spannedBases } from './spannedBases';

let container = null;
let strictDrawing = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  strictDrawing = new StrictDrawing({ SVG: { SVG: NodeSVG } });
  strictDrawing.appendTo(container);
});

afterEach(() => {
  strictDrawing = null;

  container.remove();
  container = null;
});

describe('spannedBases function', () => {
  test('when the given two bases span multiple sequences', () => {
    let seq1 = appendSequence(strictDrawing.drawing, { id: '1', characters: 'asdf' });
    let seq2 = appendSequence(strictDrawing.drawing, { id: '2', characters: 'qw' });
    let seq3 = appendSequence(strictDrawing.drawing, { id: '3', characters: 'zxcv' });
    expect(spannedBases(
      strictDrawing,
      seq1.atPosition(3),
      seq3.atPosition(2),
    )).toStrictEqual([
      ...seq1.bases.slice(2),
      ...seq2.bases,
      ...seq3.bases.slice(0, 2),
    ]);
  });

  test('when there are no bases between the given two bases', () => {
    let seq = appendSequence(strictDrawing.drawing, { id: 'qwer', characters: 'qwerZXCV' });
    let b1 = seq.atPosition(4);
    let b2 = seq.atPosition(5);
    expect(spannedBases(strictDrawing, b1, b2)).toStrictEqual([b1, b2]);
  });

  test('when the given two bases are given in descending order', () => {
    let seq = appendSequence(strictDrawing.drawing, { id: 'zxcv', characters: 'zxcvZXCV' });
    let b1 = seq.atPosition(6);
    let b2 = seq.atPosition(2);
    expect(spannedBases(strictDrawing, b1, b2)).toStrictEqual(seq.bases.slice(1, 6));
  });

  test('when the given two bases are actually the same base', () => {
    let seq = appendSequence(strictDrawing.drawing, { id: '1', characters: 'asdf' });
    let b = seq.atPosition(3);
    expect(spannedBases(strictDrawing, b, b)).toStrictEqual([b]);
  });

  test('when either of the given two bases is not present in the drawing', () => {
    let seq = appendSequence(strictDrawing.drawing, { id: '2', characters: 'asdfQWERasdf' });
    let b = seq.atPosition(5);
    removeBases(strictDrawing.drawing, [b]);
    expect(strictDrawing.layoutSequence().positionOf(b)).toBe(0); // was removed
    // base 1 is missing
    expect(spannedBases(strictDrawing, b, seq.atPosition(3))).toStrictEqual([]);
    // base 2 is missing
    expect(spannedBases(strictDrawing, seq.atPosition(3), b)).toStrictEqual([]);
  });
});
