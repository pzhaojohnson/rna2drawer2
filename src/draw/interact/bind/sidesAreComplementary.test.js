import { Drawing } from 'Draw/Drawing';
import * as SVG from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';

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
  test('perfect complements', () => {
    let sequence = appendSequence(drawing, { id: 'asdf', characters: 'AAAAAAUUUUUUGCGCGC' });

    // sides with multiple bases
    let side1 = sequence.bases.slice(1, 5);
    let side2 = sequence.bases.slice(6, 10);
    expect(sidesAreComplementary(side1, side2)).toBeTruthy();
    expect(sidesAreComplementary(side2, side1)).toBeTruthy(); // switch order

    // sides with one base each
    side1 = [sequence.atPosition(13)];
    side2 = [sequence.atPosition(16)];
    expect(sidesAreComplementary(side1, side2)).toBeTruthy();
    expect(sidesAreComplementary(side2, side1)).toBeTruthy(); // switch order
  });

  it('is not case-sensitive', () => {
    let sequence = appendSequence(drawing, { id: 'Id', characters: 'AAAAuuuu' });
    let side1 = sequence.bases.slice(0, 3);
    let side2 = sequence.bases.slice(4, 7);
    expect(sidesAreComplementary(side1, side2)).toBeTruthy();
  });

  test('non-complementary sides', () => {
    let sequence = appendSequence(drawing, { id: 'asdf', characters: 'AAAAAAAAAAAAAAAA' });
    let side1 = sequence.bases.slice(0, 3);
    let side2 = sequence.bases.slice(5, 8);
    expect(sidesAreComplementary(side1, side2)).toBeFalsy();
  });

  test('sides of different lengths', () => {
    let sequence = appendSequence(drawing, { id: 'Id', characters: 'AAAAUUUUGGGGCCCC' });
    let side1 = sequence.bases.slice(1, 3);
    let side2 = [sequence.atPosition(6)];
    expect(sidesAreComplementary(side1, side2)).toBeFalsy();
    expect(sidesAreComplementary(side2, side1)).toBeFalsy(); // switch order
  });

  test('sides of length zero', () => {
    expect(sidesAreComplementary([], [])).toBeTruthy();
  });

  test('overlapping sides', () => {
    let sequence = appendSequence(drawing, { id: 'GC', characters: 'GCGCGCGCGCGC' });
    let side1 = sequence.bases.slice(0, 4);
    // has a complementary motif but overlaps with side 1
    let side2 = sequence.bases.slice(2, 6);
    expect(sidesAreComplementary(side1, side2)).toBeFalsy();
  });

  test('when a base has no text content', () => {
    let sequence = appendSequence(drawing, { id: 'asdf', characters: 'AAAAUUUUAAAAUUUU'});
    let side1 = sequence.bases.slice(0, 3);
    let side2 = sequence.bases.slice(5, 8);
    expect(sidesAreComplementary(side1, side2)).toBeTruthy();
    expect(sidesAreComplementary(side2, side1)).toBeTruthy(); // switch order
    side1[1].text.text(''); // remove text content
    expect(side1[1].text.text()).toBe('');
    expect(sidesAreComplementary(side1, side2)).toBeFalsy();
    expect(sidesAreComplementary(side2, side1)).toBeFalsy(); // switch order
  });

  test('when the text content of a base has multiple characters', () => {
    let sequence = appendSequence(drawing, { id: 'asdf', characters: 'AAAAUUUUAAAAUUUU'});
    let side1 = sequence.bases.slice(0, 3);
    let side2 = sequence.bases.slice(5, 8);
    expect(sidesAreComplementary(side1, side2)).toBeTruthy();
    expect(sidesAreComplementary(side2, side1)).toBeTruthy(); // switch order
    side1[1].text.text('AA'); // make two characters
    expect(side1[1].text.text()).toBe('AA');
    expect(sidesAreComplementary(side1, side2)).toBeFalsy();
    expect(sidesAreComplementary(side2, side1)).toBeFalsy(); // switch order
  });

  test('GUT option', () => {
    let sequence = appendSequence(drawing, { id: 'GUT', characters: 'GGUUTT' });
    let side1 = [sequence.atPosition(2)];
    let side2 = [sequence.atPosition(4)];
    let side3 = [sequence.atPosition(6)];
    expect(sidesAreComplementary(side1, side2, { GUT: true })).toBeTruthy();
    expect(sidesAreComplementary(side1, side3, { GUT: true })).toBeTruthy();
    expect(sidesAreComplementary(side1, side2, { GUT: false })).toBeFalsy();
    expect(sidesAreComplementary(side1, side3, { GUT: false })).toBeFalsy();
  });

  test('IUPAC option', () => {
    let sequence = appendSequence(drawing, { id: 'IUPAC', characters: 'RRRRUUUUAAAAUUUU'});
    let side1 = sequence.bases.slice(0, 3);
    let side2 = sequence.bases.slice(5, 8);
    expect(sidesAreComplementary(side1, side2, { IUPAC: true })).toBeTruthy();
    expect(sidesAreComplementary(side1, side2, { IUPAC: false })).toBeFalsy();
  });

  test('allowedMismatch option', () => {
    let sequence = appendSequence(drawing, { id: 'Mis', characters: 'AAGGCCaaaaGGCCUU' });
    let side1 = sequence.bases.slice(3, 8);
    let side2 = sequence.bases.slice(8, 13);
    expect(sidesAreComplementary(side1, side2, { allowedMismatch: 0 })).toBeFalsy();
    expect(sidesAreComplementary(side1, side2, { allowedMismatch: 0.2 })).toBeFalsy();
    expect(sidesAreComplementary(side1, side2, { allowedMismatch: 0.4 })).toBeTruthy();
    expect(sidesAreComplementary(side1, side2, { allowedMismatch: 0.6 })).toBeTruthy();
    expect(sidesAreComplementary(side1, side2, { allowedMismatch: 1 })).toBeTruthy();
  });
});
