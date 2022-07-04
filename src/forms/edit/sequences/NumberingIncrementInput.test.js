import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { unmountComponentAtNode } from 'react-dom';

import { App } from 'App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { addNumbering } from 'Draw/bases/number/add';
import { removeNumbering } from 'Draw/bases/number/add';
import { areUnnumbered } from 'Draw/bases/number/areUnnumbered';
import { updateBaseNumberings } from 'Draw/sequences/updateBaseNumberings';
import { numberingOffset } from 'Draw/sequences/numberingOffset';
import { numberingIncrement } from 'Draw/sequences/numberingIncrement';
import { numberingAnchor } from 'Draw/sequences/numberingAnchor';

import { NumberingIncrementInput } from './NumberingIncrementInput';

let app = null;
let drawing = null;
let sequence = null;

let container = null;

beforeEach(() => {
  app = new App({ SVG: { SVG: NodeSVG } });
  app.appendTo(document.body);

  drawing = app.strictDrawing.drawing;
  sequence = appendSequence(drawing, { id: 'asdf', characters: 'asdfASDFqwerQWERzxcvZXCV' });

  // remove any base numberings
  sequence.bases.forEach(b => removeNumbering(b));

  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  sequence = null;
  drawing = null;

  app.remove();
  app = null;

  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('NumberingIncrementInput component', () => {
  it('renders when the numbering increment is positive', () => {
    updateBaseNumberings(sequence, { offset: 3, increment: 6, anchor: 1 });
    expect(numberingIncrement(sequence)).toBe(6);
    act(() => {
      render(<NumberingIncrementInput app={app} sequence={sequence} />, container);
    });
    expect(container.firstChild.value).toBe('6');
  });

  it('renders when the numbering increment is undefined', () => {
    expect(areUnnumbered(sequence.bases)).toBeTruthy();
    expect(numberingIncrement(sequence)).toBeUndefined();
    act(() => {
      render(<NumberingIncrementInput app={app} sequence={sequence} />, container);
    });
    expect(container.firstChild.value).toBe('');
  });

  it('updates the numbering increment on blur', () => {
    updateBaseNumberings(sequence, { offset: 1, increment: 6, anchor: 0 });
    expect(numberingIncrement(sequence)).toBe(6);
    act(() => {
      render(<NumberingIncrementInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '8';
    Simulate.change(container.firstChild);
    expect(numberingIncrement(sequence)).toBe(6);
    Simulate.blur(container.firstChild);
    expect(numberingIncrement(sequence)).toBe(8);
  });

  it('updates the numbering increment on pressing the enter key', () => {
    updateBaseNumberings(sequence, { offset: 6, increment: 9, anchor: 1 });
    expect(numberingIncrement(sequence)).toBe(9);
    act(() => {
      render(<NumberingIncrementInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '3';
    Simulate.change(container.firstChild);
    expect(numberingIncrement(sequence)).toBe(9);
    Simulate.keyUp(container.firstChild, { key: 'Enter' });
    expect(numberingIncrement(sequence)).toBe(3);
  });

  it('pushes undo before updating the numbering increment', () => {
    updateBaseNumberings(sequence, { offset: 110, increment: 4, anchor: 20 });
    expect(numberingIncrement(sequence)).toBe(4);
    act(() => {
      render(<NumberingIncrementInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '9';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingIncrement(sequence)).toBe(9);
    let sequenceIndex = drawing.sequences.indexOf(sequence);
    app.undo();
    // new Sequence instances may have been created on undo
    let correspondingSequence = drawing.sequences[sequenceIndex];
    expect(numberingIncrement(correspondingSequence)).toBe(4); // had pushed undo
  });

  describe('when there are no base numberings already present', () => {
    test('when the input numbering increment is greater than the sequence length', () => {
      let sequence = appendSequence(drawing, { id: '12', characters: 'asdfASDFqwer' });
      expect(areUnnumbered(sequence.bases)).toBeTruthy();
      act(() => {
        render(<NumberingIncrementInput app={app} sequence={sequence} />, container);
      });
      container.firstChild.value = '15'; // greater than sequence length
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      expect(numberingOffset(sequence)).toBe(0); // defaults to zero
      expect(numberingIncrement(sequence)).toBeUndefined(); // not possible to update
      expect(numberingAnchor(sequence)).toBe(12); // the last base was numbered
    });

    test('when the input numbering increment is not greater than the sequence length', () => {
      let sequence = appendSequence(drawing, { id: '12', characters: 'asdfASDFqwer' });
      expect(areUnnumbered(sequence.bases)).toBeTruthy();
      act(() => {
        render(<NumberingIncrementInput app={app} sequence={sequence} />, container);
      });
      container.firstChild.value = '5'; // less than sequence length
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      expect(numberingOffset(sequence)).toBe(0); // defaults to zero
      expect(numberingIncrement(sequence)).toBe(5); // was updated
      expect(numberingAnchor(sequence)).toBe(5); // the numbering increment
    });

    test('when the sequence has a length of one', () => {
      let sequence = appendSequence(drawing, { id: '1', characters: 'A' });
      expect(areUnnumbered(sequence.bases)).toBeTruthy();
      act(() => {
        render(<NumberingIncrementInput app={app} sequence={sequence} />, container);
      });
      container.firstChild.value = '10';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      expect(numberingOffset(sequence)).toBe(0); // defaults to zero
      expect(numberingIncrement(sequence)).toBeUndefined(); // not possible to update
      // the only base present was numbered
      expect(sequence.bases[0].numbering).toBeTruthy();
    });
  });

  test('when there are base numberings already present', () => {
    expect(areUnnumbered(sequence.bases)).toBeTruthy();
    addNumbering(sequence.atPosition(5), 12);
    addNumbering(sequence.atPosition(7), -2);
    addNumbering(sequence.atPosition(8), 200);
    act(() => {
      render(<NumberingIncrementInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '8';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingOffset(sequence)).toBe(0); // defaults to zero
    expect(numberingIncrement(sequence)).toBe(8); // was updated
    // the first base that was already numbered was used as the numbering anchor
    expect(numberingAnchor(sequence)).toBe(5);
  });

  it('maintains the numbering offset', () => {
    updateBaseNumberings(sequence, { offset: 12, increment: 3, anchor: 2 });
    expect(numberingOffset(sequence)).toBe(12);
    expect(numberingIncrement(sequence)).toBe(3);
    act(() => {
      render(<NumberingIncrementInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '5';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingIncrement(sequence)).toBe(5); // was updated
    expect(numberingOffset(sequence)).toBe(12); // was maintained
  });

  it('converts negative inputs to positive increments', () => {
    expect(areUnnumbered(sequence.bases)).toBeTruthy();
    act(() => {
      render(<NumberingIncrementInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '-10';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingOffset(sequence)).toBe(0); // defaults to zero
    expect(numberingIncrement(sequence)).toBe(10); // made positive
    expect(numberingAnchor(sequence)).toBe(10);
  });

  test('a sequence of length zero', () => {
    let sequence = appendSequence(drawing, { id: 'Empty', characters: '' });
    expect(sequence.length).toBe(0);
    act(() => {
      render(<NumberingIncrementInput app={app} sequence={sequence} />, container);
    });
    expect(container.firstChild.value).toBe('');
    container.firstChild.value = '15';
    Simulate.change(container.firstChild);
    expect(() => {
      Simulate.blur(container.firstChild)
    }).not.toThrow();
  });

  it('ignores inputs of zero', () => {
    expect(areUnnumbered(sequence.bases)).toBeTruthy();
    act(() => {
      render(<NumberingIncrementInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '0';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(areUnnumbered(sequence.bases)).toBeTruthy(); // ignored input
    expect(app.canUndo()).toBeFalsy(); // did not push undo
    container.firstChild.value = '0.55'; // floors to zero
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(areUnnumbered(sequence.bases)).toBeTruthy(); // ignored input
    expect(app.canUndo()).toBeFalsy(); // did not push undo
  });

  it('floors non-integer inputs', () => {
    updateBaseNumberings(sequence, { offset: 12, increment: 5, anchor: 16 });
    expect(numberingIncrement(sequence)).toBe(5);
    act(() => {
      render(<NumberingIncrementInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '6.123';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingIncrement(sequence)).toBe(6); // floored
  });

  it('ignores empty inputs', () => {
    updateBaseNumberings(sequence, { offset: 215, increment: 7, anchor: 0 });
    expect(numberingIncrement(sequence)).toBe(7);
    act(() => {
      render(<NumberingIncrementInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingIncrement(sequence)).toBe(7); // did not change
    expect(app.canUndo()).toBeFalsy(); // did not push undo
  });

  it('ignores blank inputs', () => {
    updateBaseNumberings(sequence, { offset: 6, increment: 2, anchor: 500 });
    expect(numberingIncrement(sequence)).toBe(2);
    act(() => {
      render(<NumberingIncrementInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '      ';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingIncrement(sequence)).toBe(2); // did not change
    expect(app.canUndo()).toBeFalsy(); // did not push undo
  });

  it('ignores nonnumeric inputs', () => {
    updateBaseNumberings(sequence, { offset: 0, increment: 10, anchor: -15 });
    expect(numberingIncrement(sequence)).toBe(10);
    act(() => {
      render(<NumberingIncrementInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = 'Q';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingIncrement(sequence)).toBe(10); // did not change
    expect(app.canUndo()).toBeFalsy(); // did not push undo
  });

  it('ignores nonfinite inputs', () => {
    updateBaseNumberings(sequence, { offset: 33, increment: 5, anchor: -3 });
    expect(numberingIncrement(sequence)).toBe(5);
    act(() => {
      render(<NumberingIncrementInput app={app} sequence={sequence} />, container);
    });
    ['NaN', 'Infinity', '-Infinity'].forEach(value => {
      container.firstChild.value = value;
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
    });
    expect(numberingIncrement(sequence)).toBe(5); // did not change
    expect(app.canUndo()).toBeFalsy(); // never pushed undo
  });

  it('ignores inputs that are the same as the current numbering increment', () => {
    updateBaseNumberings(sequence, { offset: 12, increment: 8, anchor: 0 });
    expect(numberingIncrement(sequence)).toBe(8);
    act(() => {
      render(<NumberingIncrementInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '8';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingIncrement(sequence)).toBe(8); // did not change
    expect(app.canUndo()).toBeFalsy(); // did not push undo
  });
});
