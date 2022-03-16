import { Drawing } from 'Draw/Drawing';
import * as SVG from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { sideToMotif } from './sideToMotif';

import { sidesAreComplementary } from './sidesAreComplementary';

let container = null;
let drawing = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing({ SVG });
  drawing.appendTo(container);
});

afterEach(() => {
  drawing = null;

  container.remove();
  container = null;
});

describe('sidesAreComplementary function', () => {
  test('when the two sides are complementary', () => {
    let sequence = appendSequence(drawing, { id: 'asdf', characters: 'AAAAUUUUAAAAUUUU'});
    let side1 = sequence.bases.slice(0, 3);
    let side2 = sequence.bases.slice(5, 8);
    expect(sidesAreComplementary(side1, side2)).toBeTruthy();
  });

  test('when the two sides are not complementary', () => {
    let sequence = appendSequence(drawing, { id: 'asdf', characters: 'AAAAAAAAAAAAAAAA'});
    let side1 = sequence.bases.slice(0, 3);
    let side2 = sequence.bases.slice(5, 8);
    expect(sidesAreComplementary(side1, side2)).toBeFalsy();
  });

  test('when the two sides overlap', () => {
    let sequence = appendSequence(drawing, { id: 'GC', characters: 'GCGCGCGCGCGC' });
    let side1 = sequence.bases.slice(0, 4);
    // has a complementary motif but overlaps with side 1
    let side2 = sequence.bases.slice(2, 6);
    expect(sidesAreComplementary(side1, side2)).toBeFalsy();
  });

  test('when either of the two sides cannot be converted to a motif string', () => {
    let sequence = appendSequence(drawing, { id: 'asdf', characters: 'AAAAUUUUAAAAUUUU'});
    let side1 = sequence.bases.slice(0, 3);
    let side2 = sequence.bases.slice(5, 8);
    expect(sidesAreComplementary(side1, side2)).toBeTruthy();
    expect(sidesAreComplementary(side2, side1)).toBeTruthy(); // switch order
    side1[1].text.text(''); // remove text content
    expect(sideToMotif(side1)).toBeUndefined();
    expect(sidesAreComplementary(side1, side2)).toBeFalsy();
    expect(sidesAreComplementary(side2, side1)).toBeFalsy(); // switch order
  });

  it('passes options', () => {
    let sequence = appendSequence(drawing, { id: 'asdf', characters: 'RRRRUUUUAAAAUUUU'});
    let side1 = sequence.bases.slice(0, 3);
    let side2 = sequence.bases.slice(5, 8);
    expect(sidesAreComplementary(side1, side2, { IUPAC: true })).toBeTruthy();
    expect(sidesAreComplementary(side1, side2, { IUPAC: false })).toBeFalsy();
  });
});
