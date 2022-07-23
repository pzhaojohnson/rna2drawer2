import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { unmountComponentAtNode } from 'react-dom';

import { App } from 'App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { addNumbering } from 'Draw/bases/numberings/add';

import { NumberInput } from './NumberInput';

let app = null;
let drawing = null;
let sequence = null;
let bases = null;

let container = null;

beforeEach(() => {
  app = new App({ SVG: { SVG: NodeSVG } });
  app.appendTo(document.body);

  drawing = app.strictDrawing.drawing;
  sequence = appendSequence(drawing, { id: 'asdf', characters: 'asdfQWERasdfZXCVzxcv' });

  bases = [
    sequence.atPosition(3),
    sequence.atPosition(4),
    sequence.atPosition(6),
    sequence.atPosition(11),
  ];

  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;

  bases = null;
  sequence = null;
  drawing = null;

  app.remove();
  app = null;
});

describe('NumberInput component', () => {
  it('renders positive numbers', () => {
    bases.forEach(base => addNumbering(base, 78));
    act(() => {
      render(<NumberInput app={app} baseNumberings={bases.map(base => base.numbering)} />, container);
    });
    expect(container.firstChild.value).toBe('78');
  });

  it('renders negative numbers', () => {
    bases.forEach(base => addNumbering(base, -128));
    act(() => {
      render(<NumberInput app={app} baseNumberings={bases.map(base => base.numbering)} />, container);
    });
    expect(container.firstChild.value).toBe('-128');
  });

  it('updates number on blur', () => {
    bases.forEach(base => addNumbering(base, 10));
    act(() => {
      render(<NumberInput app={app} baseNumberings={bases.map(base => base.numbering)} />, container);
    });
    container.firstChild.value = '111';
    Simulate.change(container.firstChild);
    expect(bases.every(base => base.numbering.text.text() == '10')).toBeTruthy();
    Simulate.blur(container.firstChild);
    expect(bases.every(base => base.numbering.text.text() == '111')).toBeTruthy();
  });

  it('updates number on pressing the enter key', () => {
    bases.forEach(base => addNumbering(base, 1012));
    act(() => {
      render(<NumberInput app={app} baseNumberings={bases.map(base => base.numbering)} />, container);
    });
    container.firstChild.value = '-250';
    Simulate.change(container.firstChild);
    expect(bases.every(base => base.numbering.text.text() == '1012')).toBeTruthy();
    Simulate.keyUp(container.firstChild, { key: 'Enter' });
    expect(bases.every(base => base.numbering.text.text() == '-250')).toBeTruthy();
  });

  it('pushes undo when updating number', () => {
    bases.forEach(base => addNumbering(base, 1));
    act(() => {
      render(<NumberInput app={app} baseNumberings={bases.map(base => base.numbering)} />, container);
    });
    container.firstChild.value = '50';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(bases.every(base => base.numbering.text.text() == '50')).toBeTruthy(); // updated number
    app.undo();
    // new Base instances may have been created after undo
    let correspondingBases = bases.map(base => drawing.bases().find(b => b.id == base.id));
    expect(correspondingBases.every(base => base.numbering.text.text() == '1')).toBeTruthy(); // was undone
  });

  it('ignores empty inputs', () => {
    bases.forEach(base => addNumbering(base, 33));
    act(() => {
      render(<NumberInput app={app} baseNumberings={bases.map(base => base.numbering)} />, container);
    });
    container.firstChild.value = '';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(bases.every(base => base.numbering.text.text() == '33')).toBeTruthy(); // did not change
    expect(app.canUndo()).toBeFalsy(); // did not push undo
  });

  it('ignores blank inputs', () => {
    bases.forEach(base => addNumbering(base, -58));
    act(() => {
      render(<NumberInput app={app} baseNumberings={bases.map(base => base.numbering)} />, container);
    });
    container.firstChild.value = '      ';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(bases.every(base => base.numbering.text.text() == '-58')).toBeTruthy(); // did not change
    expect(app.canUndo()).toBeFalsy(); // did not push undo
  });

  it('ignores nonnumeric inputs', () => {
    bases.forEach(base => addNumbering(base, 109));
    act(() => {
      render(<NumberInput app={app} baseNumberings={bases.map(base => base.numbering)} />, container);
    });
    container.firstChild.value = 'asdf';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(bases.every(base => base.numbering.text.text() == '109')).toBeTruthy(); // did not change
    expect(app.canUndo()).toBeFalsy(); // did not push undo
  });

  it('ignores nonfinite inputs', () => {
    bases.forEach(base => addNumbering(base, 15));
    act(() => {
      render(<NumberInput app={app} baseNumberings={bases.map(base => base.numbering)} />, container);
    });
    ['NaN', 'Infinity', '-Infinity'].forEach(v => {
      container.firstChild.value = v;
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      expect(bases.every(base => base.numbering.text.text() == '15')).toBeTruthy(); // did not change
      expect(app.canUndo()).toBeFalsy(); // did not push undo
    });
  });

  it('does not push undo if input is the same as the current number', () => {
    bases.forEach(base => addNumbering(base, 11));
    act(() => {
      render(<NumberInput app={app} baseNumberings={bases.map(base => base.numbering)} />, container);
    });
    container.firstChild.value = '11';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(app.canUndo()).toBeFalsy(); // did not push undo
    expect(bases.every(base => base.numbering.text.text() == '11')).toBeTruthy(); // did not change either
  });

  it('floors non-integer inputs', () => {
    bases.forEach(base => addNumbering(base, 12));
    act(() => {
      render(<NumberInput app={app} baseNumberings={bases.map(base => base.numbering)} />, container);
    });
    container.firstChild.value = '140.45';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(bases.every(base => base.numbering.text.text() == '140')).toBeTruthy(); // floored
  });
});
