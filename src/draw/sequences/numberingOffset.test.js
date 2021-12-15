import { Drawing } from 'Draw/Drawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { addNumbering } from 'Draw/bases/number/add';

import { numberingOffset } from './numberingOffset';

let container = null;
let drawing = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing({ SVG: { SVG: NodeSVG } });
  drawing.appendTo(container);
});

afterEach(() => {
  drawing.clear();
  drawing = null;

  container.remove();
  container = null;
});

describe('numberingOffset function', () => {
  describe('when the numbering offset can be derived', () => {
    test('when one base has numbering', () => {
      let seq = appendSequence(drawing, { id: 'A', characters: 'asdfas' });
      addNumbering(seq.atPosition(3), -1);
      expect(numberingOffset(seq)).toBe(-4);
    });

    test('when multiple bases have numberings', () => {
      let seq = appendSequence(drawing, { id: 'zxcv', characters: 'qwerQWERqwerASDFASDF' });
      addNumbering(seq.atPosition(1), 11);
      addNumbering(seq.atPosition(2), 12);
      addNumbering(seq.atPosition(3), 13);
      addNumbering(seq.atPosition(10), 20);
      addNumbering(seq.atPosition(12), 22);
      addNumbering(seq.atPosition(16), 26);
      addNumbering(seq.atPosition(20), 30);
      expect(numberingOffset(seq)).toBe(10);
    });

    test('when the numbering offset is zero', () => {
      let seq = appendSequence(drawing, { id: 'asdf', characters: 'asdfQWERzxcv' });
      addNumbering(seq.atPosition(2), 2);
      addNumbering(seq.atPosition(8), 8);
      expect(numberingOffset(seq)).toBe(0);
    });
  });

  describe('when the numbering offset cannot be derived', () => {
    test('when the sequence is empty', () => {
      let seq = appendSequence(drawing, { id: 'empty', characters: '' });
      expect(seq.length).toBe(0);
      expect(numberingOffset(seq)).toBe(undefined);
    });

    test('when no bases have numberings', () => {
      let seq = appendSequence(drawing, { id: 'Asdf', characters: 'asdfASDFqwerQWER' });
      expect(seq.bases.some(b => b.numbering)).toBeFalsy(); // no bases have numberings
      expect(numberingOffset(seq)).toBe(undefined);
    });

    test('when a base numbering is an integer but has a different offset from the rest', () => {
      let seq = appendSequence(drawing, { id: 'Zxcv', characters: 'asdfASDFqwerQWERzxc' });
      addNumbering(seq.atPosition(2), 5);
      addNumbering(seq.atPosition(8), 11);
      addNumbering(seq.atPosition(12), 15);
      addNumbering(seq.atPosition(14), 17);
      expect(numberingOffset(seq)).toBe(3);
      seq.atPosition(12).numbering.text.wrapped.text('14');
      expect(numberingOffset(seq)).toBe(undefined);
    });

    test('when not all bases are numbered with integers', () => {
      [
        5.1, // finite but not an integer
        Infinity, -Infinity, NaN, // numeric but nonfinite
        'asdf', // nonnumeric
        '', // empty
        '    ', // blank
      ].forEach(v => {
        let seq = appendSequence(drawing, { id: v.toString(), characters: 'asdfASDFqwerQWER' });
        addNumbering(seq.atPosition(2), 4);
        addNumbering(seq.atPosition(5), 7);
        addNumbering(seq.atPosition(8), 10);
        expect(numberingOffset(seq)).toBe(2);
        seq.atPosition(5).numbering.text.wrapped.text(v.toString());
        expect(numberingOffset(seq)).toBe(undefined);
      });
    });
  });
});
