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

import { NumberingOffsetInput } from './NumberingOffsetInput';

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

describe('NumberingOffsetInput component', () => {
  it('renders when the numbering offset is zero', () => {
    updateBaseNumberings(sequence, { offset: 0, increment: 4, anchor: 3 });
    expect(numberingOffset(sequence)).toBe(0);
    act(() => {
      render(<NumberingOffsetInput app={app} sequence={sequence} />, container);
    });
    expect(container.firstChild.value).toBe('0');
  });

  it('renders when the numbering offset is positive', () => {
    updateBaseNumberings(sequence, { offset: 5, increment: 3, anchor: 2 });
    expect(numberingOffset(sequence)).toBe(5);
    act(() => {
      render(<NumberingOffsetInput app={app} sequence={sequence} />, container);
    });
    expect(container.firstChild.value).toBe('5');
  });

  it('renders when the numbering offset is negative', () => {
    updateBaseNumberings(sequence, { offset: -6, increment: 2, anchor: 10 });
    expect(numberingOffset(sequence)).toBe(-6);
    act(() => {
      render(<NumberingOffsetInput app={app} sequence={sequence} />, container);
    });
    expect(container.firstChild.value).toBe('-6');
  });

  it('renders when the numbering offset is undefined', () => {
    expect(areUnnumbered(sequence.bases)).toBeTruthy();
    expect(numberingOffset(sequence)).toBeUndefined();
    act(() => {
      render(<NumberingOffsetInput app={app} sequence={sequence} />, container);
    });
    expect(container.firstChild.value).toBe('');
  });

  it('updates the numbering offset on blur', () => {
    updateBaseNumberings(sequence, { offset: 10, increment: 9, anchor: 1 });
    expect(numberingOffset(sequence)).toBe(10);
    act(() => {
      render(<NumberingOffsetInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '8';
    Simulate.change(container.firstChild);
    expect(numberingOffset(sequence)).toBe(10);
    Simulate.blur(container.firstChild);
    expect(numberingOffset(sequence)).toBe(8);
  });

  it('updates the numbering offset on pressing the enter key', () => {
    updateBaseNumberings(sequence, { offset: 6, increment: 9, anchor: 1 });
    expect(numberingOffset(sequence)).toBe(6);
    act(() => {
      render(<NumberingOffsetInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '8';
    Simulate.change(container.firstChild);
    expect(numberingOffset(sequence)).toBe(6);
    Simulate.keyUp(container.firstChild, { key: 'Enter' });
    expect(numberingOffset(sequence)).toBe(8);
  });

  it('pushes undo before updating the numbering offset', () => {
    updateBaseNumberings(sequence, { offset: 7, increment: 5, anchor: 2 });
    expect(numberingOffset(sequence)).toBe(7);
    act(() => {
      render(<NumberingOffsetInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '11';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingOffset(sequence)).toBe(11);
    let sequenceIndex = drawing.sequences.indexOf(sequence);
    app.undo();
    // new Sequence instances may have been created on undo
    let correspondingSequence = drawing.sequences[sequenceIndex];
    expect(numberingOffset(correspondingSequence)).toBe(7); // had pushed undo
  });

  it('adds base numberings when none are already present', () => {
    expect(areUnnumbered(sequence.bases)).toBeTruthy();
    act(() => {
      render(<NumberingOffsetInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '12';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingOffset(sequence)).toBe(12);
    expect(areUnnumbered(sequence.bases)).toBeFalsy();
    expect(numberingIncrement(sequence)).toBe(20); // a good default increment
    // starting the numbering at the first base ensures that at least one base
    // is numbered for any nonempty sequence
    expect(sequence.bases[0].numbering).toBeTruthy();
  });

  it('only edits existing base numberings if already present', () => {
    let sequence = appendSequence(drawing, { id: '12', characters: 'asdfASDFqwer' });
    expect(areUnnumbered(sequence.bases)).toBeTruthy();
    // results in both the numbering offset and increment being undefined
    addNumbering(sequence.atPosition(1), 5);
    addNumbering(sequence.atPosition(3), 9);
    addNumbering(sequence.atPosition(7), 1);
    addNumbering(sequence.atPosition(8), -1);
    addNumbering(sequence.atPosition(11), 2);
    sequence.atPosition(11).numbering.text.wrapped.text('asdf'); // make nonnumeric
    act(() => {
      render(<NumberingOffsetInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '-15';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingOffset(sequence)).toBe(-15);
    expect(numberingIncrement(sequence)).toBeUndefined(); // still undefined
    let numberedBases = [1, 3, 7, 8, 11].map(p => sequence.atPosition(p));
    expect(numberedBases.every(b => b.numbering)).toBeTruthy();
    let unnumberedBases = [2, 4, 5, 6, 9, 10, 12].map(p => sequence.atPosition(p));
    expect(areUnnumbered(unnumberedBases)).toBeTruthy();
  });

  it('ignores empty inputs', () => {
    updateBaseNumberings(sequence, { offset: 15, increment: 3, anchor: 20 });
    expect(numberingOffset(sequence)).toBe(15);
    act(() => {
      render(<NumberingOffsetInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingOffset(sequence)).toBe(15); // did not change
    expect(app.canUndo()).toBeFalsy(); // did not push undo
  });

  it('ignores blank inputs', () => {
    updateBaseNumberings(sequence, { offset: 3, increment: 6, anchor: 21 });
    expect(numberingOffset(sequence)).toBe(3);
    act(() => {
      render(<NumberingOffsetInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '      ';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingOffset(sequence)).toBe(3); // did not change
    expect(app.canUndo()).toBeFalsy(); // did not push undo
  });

  it('ignores nonnumeric inputs', () => {
    updateBaseNumberings(sequence, { offset: 12, increment: 3, anchor: 20 });
    expect(numberingOffset(sequence)).toBe(12);
    act(() => {
      render(<NumberingOffsetInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = 'Q';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingOffset(sequence)).toBe(12); // did not change
    expect(app.canUndo()).toBeFalsy(); // did not push undo
  });

  it('ignores nonfinite inputs', () => {
    ['NaN', 'Infinity', '-Infinity'].forEach(value => {
      updateBaseNumberings(sequence, { offset: 11, increment: 3, anchor: 9 });
      expect(numberingOffset(sequence)).toBe(11);
      act(() => {
        render(<NumberingOffsetInput app={app} sequence={sequence} />, container);
      });
      container.firstChild.value = value;
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      expect(numberingOffset(sequence)).toBe(11); // did not change
      expect(app.canUndo()).toBeFalsy(); // did not push undo
    });
  });

  it('ignores inputs that are the same as the current numbering offset', () => {
    updateBaseNumberings(sequence, { offset: 8, increment: 3, anchor: 11 });
    expect(numberingOffset(sequence)).toBe(8);
    act(() => {
      render(<NumberingOffsetInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '8';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingOffset(sequence)).toBe(8); // did not change
    expect(app.canUndo()).toBeFalsy(); // did not push undo
  });

  it('floors non-integer inputs', () => {
    updateBaseNumberings(sequence, { offset: 12, increment: 5, anchor: 16 });
    expect(numberingOffset(sequence)).toBe(12);
    act(() => {
      render(<NumberingOffsetInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '3.123';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingOffset(sequence)).toBe(3); // floored
  });
});
