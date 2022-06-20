import { Drawing } from 'Draw/Drawing';
import * as SVG from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { updateBaseNumberings } from 'Draw/sequences/updateBaseNumberings';
import { numberingOffset } from 'Draw/sequences/numberingOffset';

import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { DisplayableSequenceRange } from './DisplayableSequenceRange';

// &nbsp; character code
const nbsp = '\xa0';

let drawingContainer = null;
let drawing = null;

// for DisplayableSequenceRange component to test
let container = null;

beforeEach(() => {
  drawingContainer = document.createElement('div');
  document.body.appendChild(drawingContainer);

  drawing = new Drawing({ SVG });
  drawing.appendTo(drawingContainer);

  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;

  drawing = null;

  drawingContainer.remove();
  drawingContainer = null;
});

describe('DisplayableSequenceRange component', () => {
  test('an empty sequence', () => {
    let sequence = appendSequence(drawing, { id: 'empty', characters: '' });
    expect(sequence.length).toBe(0);
    // numbering offset will always be undefined for an empty sequence
    expect(numberingOffset(sequence)).toBeUndefined();
    act(() => {
      render(<DisplayableSequenceRange sequence={sequence} />, container);
    });
    expect(container.textContent).toBe(`0...0${nbsp}is the sequence range.`);
  });

  test('a sequence of length one with no numbering', () => {
    let sequence = appendSequence(drawing, { id: 'one', characters: 'A' });
    expect(sequence.length).toBe(1);
    expect(sequence.atPosition(1).numbering).toBeFalsy();
    act(() => {
      render(<DisplayableSequenceRange sequence={sequence} />, container);
    });
    expect(container.textContent).toBe(`1...1${nbsp}is the sequence range.`);
  });

  test('a sequence of length one with numbering', () => {
    let sequence = appendSequence(drawing, { id: '1', characters: 'q' });
    expect(sequence.length).toBe(1);
    updateBaseNumberings(sequence, { offset: 23, increment: 1, anchor: 1 });
    expect(sequence.atPosition(1).numbering).toBeTruthy();
    act(() => {
      render(<DisplayableSequenceRange sequence={sequence} />, container);
    });
    expect(container.textContent).toBe(`24...24${nbsp}is the sequence range.`);
  });

  test('a sequence of length greater than one with no numbering', () => {
    let sequence = appendSequence(drawing, { id: '7', characters: 'ASDFqwe' });
    expect(sequence.length).toBe(7);
    expect(sequence.bases.every(base => !base.numbering)).toBeTruthy();
    act(() => {
      render(<DisplayableSequenceRange sequence={sequence} />, container);
    });
    expect(container.textContent).toBe(`1...7${nbsp}is the sequence range.`);
  });

  test('a sequence of length greater than one with a defined numbering offset', () => {
    let sequence = appendSequence(drawing, { id: '24', characters: 'zxcvZXCVqwerASDFQWERasdf' });
    expect(sequence.length).toBe(24);
    updateBaseNumberings(sequence, { offset: -89, increment: 5, anchor: 3 });
    expect(numberingOffset(sequence)).toBe(-89);
    act(() => {
      render(<DisplayableSequenceRange sequence={sequence} />, container);
    });
    expect(container.textContent).toBe(`-88...-65${nbsp}is the sequence range.`);
  });

  test('a sequence of length greater than one with an undefined numbering offset', () => {
    let sequence = appendSequence(drawing, { id: '15', characters: 'qqqqWERAzxcvVCZ' });
    expect(sequence.length).toBe(15);
    updateBaseNumberings(sequence, { offset: 3, increment: 4, anchor: 1 });
    sequence.atPosition(5).numbering.text.text('112');
    expect(numberingOffset(sequence)).toBeUndefined();
    act(() => {
      render(<DisplayableSequenceRange sequence={sequence} />, container);
    });
    expect(container.textContent).toBe(`1...15${nbsp}is the sequence range.`);
  });

  it('renders with specified CSS styles', () => {
    let sequence = appendSequence(drawing, { id: '1', characters: 'asdfQWER' });
    act(() => {
      render(
        <DisplayableSequenceRange sequence={sequence} style={{ marginTop: '80.93px' }} />,
        container,
      );
    });
    expect(container.firstChild.style.marginTop).toBe('80.93px');
  });
});
