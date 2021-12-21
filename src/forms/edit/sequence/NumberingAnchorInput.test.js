import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { unmountComponentAtNode } from 'react-dom';

import { App } from 'App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { removeNumbering } from 'Draw/bases/number/add';
import { areUnnumbered } from 'Draw/bases/number/areUnnumbered';
import { updateBaseNumberings } from 'Draw/sequences/updateBaseNumberings';
import { numberingOffset } from 'Draw/sequences/numberingOffset';
import { numberingIncrement } from 'Draw/sequences/numberingIncrement';
import { numberingAnchor } from 'Draw/sequences/numberingAnchor';

import { NumberingAnchorInput } from './NumberingAnchorInput';

let app = null;
let drawing = null;
let sequence = null;

let container = null;

beforeEach(() => {
  app = new App({ SVG: { SVG: NodeSVG } });
  app.appendTo(document.body);

  drawing = app.strictDrawing.drawing;
  sequence = appendSequence(drawing, {
    id: 'ASDF',
    characters: 'asdfASDFqwerQWER1234zxcvZXCVfdsaFDSArewqREWQ4321',
  });

  // remove any base numberings
  sequence.bases.forEach(b => removeNumbering(b));

  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;

  sequence = null;
  drawing = null;

  app.remove();
  app = null;
});

describe('NumberingAnchorInput component', () => {
  it('displays the numbering anchor', () => {
    updateBaseNumberings(sequence, { offset: 0, increment: 6, anchor: 5 });
    expect(numberingAnchor(sequence)).toBe(5);
    act(() => {
      render(<NumberingAnchorInput app={app} sequence={sequence} />, container);
    });
    expect(container.firstChild.value).toBe('5');
  });

  it('accounts for the numbering offset when displaying the numbering anchor', () => {
    updateBaseNumberings(sequence, { offset: -11, increment: 5, anchor: 3 });
    expect(numberingAnchor(sequence)).toBe(3);
    act(() => {
      render(<NumberingAnchorInput app={app} sequence={sequence} />, container);
    });
    expect(container.firstChild.value).toBe('-8');
  });

  it('updates the numbering anchor on blur', () => {
    updateBaseNumberings(sequence, { offset: 0, increment: 8, anchor: 3 });
    act(() => {
      render(<NumberingAnchorInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '5';
    Simulate.change(container.firstChild);
    expect(numberingAnchor(sequence)).toBe(3);
    Simulate.blur(container.firstChild);
    expect(numberingAnchor(sequence)).toBe(5);
  });

  it('updates the numbering anchor on pressing the enter key', () => {
    updateBaseNumberings(sequence, { offset: 0, increment: 10, anchor: 2 });
    act(() => {
      render(<NumberingAnchorInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '6';
    Simulate.change(container.firstChild);
    expect(numberingAnchor(sequence)).toBe(2);
    Simulate.keyUp(container.firstChild, { key: 'Enter' });
    expect(numberingAnchor(sequence)).toBe(6);
  });

  it('pushes undo before updating the numbering anchor', () => {
    updateBaseNumberings(sequence, { offset: 0, increment: 9, anchor: 2 });
    act(() => {
      render(<NumberingAnchorInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '5';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingAnchor(sequence)).toBe(5);
    let sequenceIndex = drawing.sequences.indexOf(sequence);
    app.undo();
    // new Sequence instances may have been created on undo
    let correspondingSequence = drawing.sequences[sequenceIndex];
    expect(numberingAnchor(correspondingSequence)).toBe(2); // had pushed undo
  });

  it('accounts for the numbering offset in processing inputs', () => {
    updateBaseNumberings(sequence, { offset: -8, increment: 9, anchor: 3 });
    act(() => {
      render(<NumberingAnchorInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '-12';
    Simulate.change(container.firstChild);
    expect(numberingAnchor(sequence)).toBe(3);
    Simulate.blur(container.firstChild);
    expect(numberingAnchor(sequence)).toBe(5);
  });

  it('maintains the numbering offset and increment when updating base numberings', () => {
    updateBaseNumberings(sequence, { offset: -100, increment: 5, anchor: 3 });
    act(() => {
      render(<NumberingAnchorInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '7';
    Simulate.change(container.firstChild);
    expect(numberingAnchor(sequence)).toBe(3);
    Simulate.blur(container.firstChild);
    expect(numberingOffset(sequence)).toBe(-100); // was maintained
    expect(numberingIncrement(sequence)).toBe(5); // was maintained
    expect(numberingAnchor(sequence)).toBe(2); // was changed
  });

  describe('when the numbering offset and increment are undefined', () => {
    it('uses a numbering offset of zero and a numbering increment of 20', () => {
      expect(areUnnumbered(sequence.bases)).toBeTruthy();
      act(() => {
        render(<NumberingAnchorInput app={app} sequence={sequence} />, container);
      });
      container.firstChild.value = 3;
      Simulate.change(container.firstChild);
      expect(numberingOffset(sequence)).toBeUndefined();
      expect(numberingIncrement(sequence)).toBeUndefined();
      expect(numberingAnchor(sequence)).toBeUndefined();
      Simulate.blur(container.firstChild);
      expect(numberingOffset(sequence)).toBe(0);
      expect(numberingIncrement(sequence)).toBe(20);
      expect(numberingAnchor(sequence)).toBe(3);
    });
  });

  it('floors non-integer inputs', () => {
    updateBaseNumberings(sequence, { offset: 0, increment: 8, anchor: 0 });
    act(() => {
      render(<NumberingAnchorInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '5.68';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingAnchor(sequence)).toBe(5); // was floored
  });

  it('ignores empty inputs', () => {
    updateBaseNumberings(sequence, { offset: 2, increment: 15, anchor: 8 });
    act(() => {
      render(<NumberingAnchorInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingAnchor(sequence)).toBe(8); // unchanged
    expect(app.canUndo()).toBeFalsy(); // did not push undo
  });

  it('ignores blank inputs', () => {
    updateBaseNumberings(sequence, { offset: 0, increment: 12, anchor: 4 });
    act(() => {
      render(<NumberingAnchorInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = '   ';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingAnchor(sequence)).toBe(4); // unchanged
    expect(app.canUndo()).toBeFalsy(); // did not push undo
  });

  it('ignores nonnumeric inputs', () => {
    updateBaseNumberings(sequence, { offset: 20, increment: 11, anchor: 5 });
    act(() => {
      render(<NumberingAnchorInput app={app} sequence={sequence} />, container);
    });
    container.firstChild.value = 'zxcv';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(numberingAnchor(sequence)).toBe(5); // unchanged
    expect(app.canUndo()).toBeFalsy(); // did not push undo
  });

  it('ignores nonfinite inputs', () => {
    ['NaN', 'Infinity', '-Infinity'].forEach(value => {
      updateBaseNumberings(sequence, { offset: 0, increment: 10, anchor: 2 });
      act(() => {
        render(<NumberingAnchorInput app={app} sequence={sequence} />, container);
      });
      container.firstChild.value = value;
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      expect(numberingAnchor(sequence)).toBe(2); // unchanged
      expect(app.canUndo()).toBeFalsy(); // did not push undo
    });
  });
});
