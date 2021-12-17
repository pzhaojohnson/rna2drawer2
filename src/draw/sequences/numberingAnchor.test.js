import { Drawing } from 'Draw/Drawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { addNumbering } from 'Draw/bases/number/add';
import { areUnnumbered } from 'Draw/bases/number/areUnnumbered';
import { numberingOffset } from 'Draw/sequences/numberingOffset';
import { numberingIncrement } from 'Draw/sequences/numberingIncrement';

import { numberingAnchor } from './numberingAnchor';

let container = null;
let drawing = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing({ SVG: { SVG: NodeSVG } });
  drawing.appendTo(container);
});

afterEach(() => {
  drawing = null;

  container.remove();
  container = null;
});

describe('numberingAnchor function', () => {
  describe('when the numbering anchor can be derived', () => {
    test('when there are multiple base numberings', () => {
      let seq = appendSequence(drawing, { id: 'QWER', characters: 'QWERqwerASDFasdf' });
      expect(areUnnumbered(seq.bases)).toBeTruthy();
      addNumbering(seq.atPosition(2), 8);
      addNumbering(seq.atPosition(6), 12);
      addNumbering(seq.atPosition(10), 16);
      addNumbering(seq.atPosition(14), 20);
      expect(numberingOffset(seq)).toBe(6);
      expect(numberingIncrement(seq)).toBe(4);
      expect(numberingAnchor(seq)).toBe(2);
    });

    test('when there is only one base numbering', () => {
      let seq = appendSequence(drawing, { id: 'one', characters: 'asdfas' });
      expect(areUnnumbered(seq.bases)).toBeTruthy();
      addNumbering(seq.atPosition(3), 5);
      expect(numberingOffset(seq)).toBe(2);
      expect(numberingIncrement(seq)).toBeUndefined();
      // is defined even though the numbering increment is undefined
      expect(numberingAnchor(seq)).toBe(3);
    });
  });

  describe('when the numbering anchor cannot be derived', () => {
    test('an empty sequence', () => {
      let seq = appendSequence(drawing, { id: 'id', characters: '' });
      expect(seq.length).toBe(0);
      expect(numberingAnchor(seq)).toBeUndefined();
    });

    test('when there are no base numberings', () => {
      let seq = appendSequence(drawing, { id: 'Unnumbered', characters: 'asdfASDF' });
      expect(areUnnumbered(seq.bases)).toBeTruthy();
      expect(numberingAnchor(seq)).toBeUndefined();
    });

    test('when base numberings have inconsistent offsets', () => {
      let seq = appendSequence(drawing, { id: 'ASDF', characters: 'asdfQWER' });
      expect(areUnnumbered(seq.bases)).toBeTruthy();
      addNumbering(seq.atPosition(2), 4);
      addNumbering(seq.atPosition(5), 7);
      addNumbering(seq.atPosition(8), 10);
      expect(numberingOffset(seq)).toBe(2);
      expect(numberingAnchor(seq)).toBe(2);
      seq.atPosition(5).numbering.text.wrapped.text('6'); // an inconsistent offset
      expect(numberingOffset(seq)).toBeUndefined();
      expect(numberingAnchor(seq)).toBeUndefined();
    });

    test('when the increments between base numberings are inconsistent', () => {
      let seq = appendSequence(drawing, { id: 'ZXCV', characters: 'zxcvZXCV' });
      expect(areUnnumbered(seq.bases)).toBeTruthy();
      addNumbering(seq.atPosition(2), 1);
      addNumbering(seq.atPosition(7), 6);
      expect(numberingOffset(seq)).toBe(-1);
      expect(numberingIncrement(seq)).toBe(5);
      expect(numberingAnchor(seq)).toBe(2);
      addNumbering(seq.atPosition(4), 3); // introduces inconsistent increments
      expect(numberingOffset(seq)).toBe(-1); // still defined
      expect(numberingIncrement(seq)).toBeUndefined();
      expect(numberingAnchor(seq)).toBeUndefined();
    });

    test('when the text of a base numbering does not parse to an integer', () => {
      let seq = appendSequence(drawing, { id: 'A', characters: '1234asdfQWER' });
      expect(areUnnumbered(seq.bases)).toBeTruthy();
      addNumbering(seq.atPosition(3), 3);
      addNumbering(seq.atPosition(7), 7);
      addNumbering(seq.atPosition(11), 11);
      expect(numberingOffset(seq)).toBe(0);
      expect(numberingIncrement(seq)).toBe(4);
      expect(numberingAnchor(seq)).toBe(3);
      seq.atPosition(11).numbering.text.wrapped.text('Q'); // not an integer
      expect(numberingOffset(seq)).toBeUndefined();
      expect(numberingIncrement(seq)).toBeUndefined();
      expect(numberingAnchor(seq)).toBeUndefined();
    });
  });
});
