import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { unmountComponentAtNode } from 'react-dom';

import { App } from 'App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { addNumbering } from 'Draw/bases/number/add';

import { NumberInput } from './NumberInput';

let app = null;
let drawing = null;
let sequence = null;
let base = null;

let container = null;

beforeEach(() => {
  app = new App({ SVG: { SVG: NodeSVG } });
  app.appendTo(document.body);

  drawing = app.strictDrawing.drawing;
  sequence = appendSequence(drawing, { id: 'asdf', characters: 'asdfQWERasdfZXCVzxcv' });
  base = sequence.atPosition(3);

  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;

  base = null;
  sequence = null;
  drawing = null;

  app.remove();
  app = null;
});

describe('NumberInput component', () => {
  it('renders positive numbers', () => {
    addNumbering(base, 78);
    act(() => {
      render(<NumberInput app={app} baseNumbering={base.numbering} />, container);
    });
    expect(container.firstChild.value).toBe('78');
  });

  it('renders negative numbers', () => {
    addNumbering(base, -128);
    act(() => {
      render(<NumberInput app={app} baseNumbering={base.numbering} />, container);
    });
    expect(container.firstChild.value).toBe('-128');
  });

  it('updates number on blur', () => {
    addNumbering(base, 10);
    act(() => {
      render(<NumberInput app={app} baseNumbering={base.numbering} />, container);
    });
    container.firstChild.value = '111';
    Simulate.change(container.firstChild);
    expect(base.numbering.text.wrapped.text()).toBe('10');
    Simulate.blur(container.firstChild);
    expect(base.numbering.text.wrapped.text()).toBe('111');
  });

  it('updates number on pressing the enter key', () => {
    addNumbering(base, 1012);
    act(() => {
      render(<NumberInput app={app} baseNumbering={base.numbering} />, container);
    });
    container.firstChild.value = '-250';
    Simulate.change(container.firstChild);
    expect(base.numbering.text.wrapped.text()).toBe('1012');
    Simulate.keyUp(container.firstChild, { key: 'Enter' });
    expect(base.numbering.text.wrapped.text()).toBe('-250');
  });

  it('pushes undo when updating number', () => {
    addNumbering(base, 1);
    act(() => {
      render(<NumberInput app={app} baseNumbering={base.numbering} />, container);
    });
    container.firstChild.value = '50';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(base.numbering.text.wrapped.text()).toBe('50'); // updated number
    app.undo();
    // new Base instances may have been created after undo
    let correspondingBase = drawing.bases().find(b => b.id == base.id);
    expect(correspondingBase.numbering.text.wrapped.text()).toBe('1'); // was undone
  });

  it('ignores empty inputs', () => {
    addNumbering(base, 33);
    act(() => {
      render(<NumberInput app={app} baseNumbering={base.numbering} />, container);
    });
    container.firstChild.value = '';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(base.numbering.text.wrapped.text()).toBe('33'); // did not change
    expect(app.canUndo()).toBeFalsy(); // did not push undo
  });

  it('ignores blank inputs', () => {
    addNumbering(base, -58);
    act(() => {
      render(<NumberInput app={app} baseNumbering={base.numbering} />, container);
    });
    container.firstChild.value = '      ';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(base.numbering.text.wrapped.text()).toBe('-58'); // did not change
    expect(app.canUndo()).toBeFalsy(); // did not push undo
  });

  it('ignores nonnumeric inputs', () => {
    addNumbering(base, 109);
    act(() => {
      render(<NumberInput app={app} baseNumbering={base.numbering} />, container);
    });
    container.firstChild.value = 'asdf';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(base.numbering.text.wrapped.text()).toBe('109'); // did not change
    expect(app.canUndo()).toBeFalsy(); // did not push undo
  });

  it('ignores nonfinite inputs', () => {
    addNumbering(base, 15);
    act(() => {
      render(<NumberInput app={app} baseNumbering={base.numbering} />, container);
    });
    ['NaN', 'Infinity', '-Infinity'].forEach(v => {
      container.firstChild.value = v;
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      expect(base.numbering.text.wrapped.text()).toBe('15'); // did not change
      expect(app.canUndo()).toBeFalsy(); // did not push undo
    });
  });

  it('does not push undo if input is the same as the current number', () => {
    addNumbering(base, 11);
    act(() => {
      render(<NumberInput app={app} baseNumbering={base.numbering} />, container);
    });
    container.firstChild.value = '11';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(app.canUndo()).toBeFalsy(); // did not push undo
    expect(base.numbering.text.wrapped.text()).toBe('11'); // did not change either
  });

  it('floors non-integer inputs', () => {
    addNumbering(base, 12);
    act(() => {
      render(<NumberInput app={app} baseNumbering={base.numbering} />, container);
    });
    container.firstChild.value = '140.45';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);
    expect(base.numbering.text.wrapped.text()).toBe('140'); // floored
  });
});
