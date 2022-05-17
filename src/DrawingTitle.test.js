import { Drawing } from 'Draw/Drawing';
import * as SVG from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';

import { DrawingTitle } from './DrawingTitle';

let container = null;
let drawing = null;
let drawingTitle = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing({ SVG });
  drawing.appendTo(container);

  drawingTitle = new DrawingTitle({ drawing });
});

afterEach(() => {
  drawingTitle = null;
  drawing = null;

  container.remove();
  container = null;
});

describe('DrawingTitle class', () => {
  describe('unspecifiedValue getter', () => {
    test('when the drawing has no sequences', () => {
      expect(drawing.sequences.length).toBe(0);
      expect(drawingTitle.unspecifiedValue).toBe('Drawing');
    });

    test('when the drawing has one sequence', () => {
      appendSequence(drawing, { id: 'AA 1234', characters: 'asdfASDFqwer' });
      expect(drawingTitle.unspecifiedValue).toBe('AA 1234');
    });

    test('when the drawing has multiple sequences', () => {
      appendSequence(drawing, { id: 'abc d34', characters: 'asdf' });
      appendSequence(drawing, { id: 'Q', characters: 'qwer' });
      appendSequence(drawing, { id: 'nmNMMNmn', characters: 'zxcv' });
      expect(drawingTitle.unspecifiedValue).toBe('abc d34, Q, nmNMMNmn');
    });

    test('a sequence with a blank ID', () => {
      appendSequence(drawing, { id: '  ', characters: 'qwer' });
      expect(drawingTitle.unspecifiedValue).toBe('Drawing');
    });
  });

  test('specifiedValue getter, value getter and setter, and unspecify method', () => {
    appendSequence(drawing, { id: 'asdf', characters: 'asdfASDF' });
    appendSequence(drawing, { id: 'qwer', characters: 'QWer', });
    expect(drawingTitle.specifiedValue).toBeUndefined();
    expect(drawingTitle.value).toBe('asdf, qwer'); // the unspecified value
    drawingTitle.value = '112234';
    expect(drawingTitle.specifiedValue).toBe('112234'); // was set
    expect(drawingTitle.value).toBe('112234'); // the specified value
    drawingTitle.unspecify();
    expect(drawingTitle.specifiedValue).toBeUndefined(); // was undefined
    expect(drawingTitle.value).toBe('asdf, qwer'); // was unspecified
  });
});
