import { Drawing } from 'Draw/Drawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { addNumbering } from 'Draw/bases/number/add';
import { removeNumbering } from 'Draw/bases/number/add';
import { areUnnumbered } from 'Draw/bases/number/areUnnumbered';
import { numberingOffset } from 'Draw/sequences/numberingOffset';

import { numberingIncrement } from './numberingIncrement';

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

describe('numberingIncrement function', () => {
  describe('when the numbering increment can be derived', () => {
    test('when two bases are numbered', () => {
      let seq = appendSequence(drawing, { id: 'Asdf', characters: 'asdfASDF' });
      addNumbering(seq.atPosition(2), 3);
      addNumbering(seq.atPosition(6), 7);
      expect(numberingIncrement(seq)).toBe(4);
    });

    test('when more than two bases are numbered', () => {
      let seq = appendSequence(drawing, { id: 'qwer', characters: '1234zxcvZXCV' });
      addNumbering(seq.atPosition(1), 9);
      addNumbering(seq.atPosition(4), 12);
      addNumbering(seq.atPosition(7), 15);
      addNumbering(seq.atPosition(10), 18);
      expect(numberingIncrement(seq)).toBe(3);
    });

    test('when the numbering increment is one', () => {
      let seq = appendSequence(drawing, { id: '1', characters: 'ZXCV' });
      addNumbering(seq.atPosition(1), 1);
      addNumbering(seq.atPosition(2), 2);
      addNumbering(seq.atPosition(3), 3);
      addNumbering(seq.atPosition(4), 4);
      expect(numberingIncrement(seq)).toBe(1);
    });
  });

  describe('when the numbering increment cannot be derived', () => {
    test('an empty sequence', () => {
      let seq = appendSequence(drawing, { id: 'Empty', characters: '' });
      expect(numberingIncrement(seq)).toBeUndefined();
    });

    test('when no bases are numbered', () => {
      let seq = appendSequence(drawing, { id: '1234', characters: '1234as' });
      expect(areUnnumbered(seq.bases)).toBeTruthy();
      expect(numberingIncrement(seq)).toBeUndefined();
    });

    test('when only one base is numbered', () => {
      let seq = appendSequence(drawing, { id: 'QWER', characters: 'QWERzxcv' });
      expect(areUnnumbered(seq.bases)).toBeTruthy();
      addNumbering(seq.atPosition(3), 3);
      expect(numberingOffset(seq)).toBe(0);
      expect(numberingIncrement(seq)).toBeUndefined();
    });

    test('a sequence of length one', () => {
      let seq = appendSequence(drawing, { id: '1', characters: 'A' });
      addNumbering(seq.atPosition(1), 6);
      expect(numberingOffset(seq)).toBe(5);
      expect(numberingIncrement(seq)).toBeUndefined();
    });

    test('when the increment between base numberings is inconsistent', () => {
      let seq = appendSequence(drawing, { id: '12', characters: '1234qwerASDF' });
      expect(areUnnumbered(seq.bases)).toBeTruthy();
      addNumbering(seq.atPosition(2), 5);
      addNumbering(seq.atPosition(6), 9);
      addNumbering(seq.atPosition(10), 13);
      expect(numberingIncrement(seq)).toBe(4);
      addNumbering(seq.atPosition(12), 15);
      expect(numberingOffset(seq)).toBe(3); // still defined
      expect(numberingIncrement(seq)).toBeUndefined();
    });

    test('when leading bases are missing numberings', () => {
      let seq = appendSequence(drawing, { id: 'zxcv', characters: 'zcxvZXCV' });
      expect(areUnnumbered(seq.bases)).toBeTruthy();
      addNumbering(seq.atPosition(1), -3);
      addNumbering(seq.atPosition(4), 0);
      addNumbering(seq.atPosition(7), 3);
      expect(numberingIncrement(seq)).toBe(3);
      removeNumbering(seq.atPosition(1));
      expect(numberingOffset(seq)).toBe(-4); // still defined
      expect(numberingIncrement(seq)).toBeUndefined();
    });

    test('when trailing bases are missing numberings', () => {
      let seq = appendSequence(drawing, { id: 'ZXCV', characters: 'ZXCVxzcv' });
      expect(areUnnumbered(seq.bases)).toBeTruthy();
      addNumbering(seq.atPosition(8), 10);
      addNumbering(seq.atPosition(5), 7);
      addNumbering(seq.atPosition(2), 4);
      expect(numberingIncrement(seq)).toBe(3);
      removeNumbering(seq.atPosition(8));
      expect(numberingOffset(seq)).toBe(2); // still defined
      expect(numberingIncrement(seq)).toBeUndefined();
    });

    describe('when the numbering offset is undefined', () => {
      test('when base numberings have inconsistent offsets', () => {
        let seq = appendSequence(drawing, { id: 'QWER', characters: 'qwerQW' });
        expect(areUnnumbered(seq.bases)).toBeTruthy();
        addNumbering(seq.atPosition(2), 7);
        addNumbering(seq.atPosition(6), 11);
        expect(numberingOffset(seq)).toBe(5);
        expect(numberingIncrement(seq)).toBe(4);
        seq.atPosition(6).numbering.text.text('12');
        expect(numberingOffset(seq)).toBeUndefined();
        expect(numberingIncrement(seq)).toBeUndefined();
      });

      test('when a base is not numbered with an integer', () => {
        let seq = appendSequence(drawing, { id: 'asDF', characters: 'asDFAS' });
        expect(areUnnumbered(seq.bases)).toBeTruthy();
        addNumbering(seq.atPosition(1), -2);
        addNumbering(seq.atPosition(5), 2);
        expect(numberingOffset(seq)).toBe(-3);
        expect(numberingIncrement(seq)).toBe(4);
        seq.atPosition(5).numbering.text.text('asdf');
        expect(numberingOffset(seq)).toBeUndefined();
        expect(numberingIncrement(seq)).toBeUndefined();
      });
    });
  });
});
