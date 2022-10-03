import { App } from 'App';

import * as SVG from 'Draw/svg/NodeSVG';

import { appendSequence } from 'Draw/sequences/add/sequence';

import * as React from 'react';

import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { act } from 'react-dom/test-utils';
import { Simulate } from 'react-dom/test-utils';

import { SequenceIdInput } from './SequenceIdInput';

class DrawingWrapper {
  constructor(drawing) {
    this.drawing = drawing;
  }

  get sequences() {
    return this.drawing.sequences;
  }

  appendSequence(sequenceSpecification) {
    appendSequence(this.drawing, {
      id: sequenceSpecification.id,
      characters: sequenceSpecification.sequence,
    });
  }
}

let app = null;

let container = null;

beforeEach(() => {
  app = new App({ SVG });
  app.appendTo(document.body);

  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;

  app.remove();
  app = null;
});

describe('SequenceIdInput component', () => {
  it('displays the current sequence ID', () => {
    let drawing = new DrawingWrapper(app.drawing);
    drawing.appendSequence({ id: 'AS12c', sequence: 'zxcvzxcv' });

    act(() => render(
      <SequenceIdInput app={app} sequence={drawing.sequences[0]} />,
      container,
    ));

    expect(container.firstChild.value).toBe('AS12c');
  });

  it('sets the sequence ID on blur', () => {
    let drawing = new DrawingWrapper(app.drawing);
    drawing.appendSequence({ id: 'asdf', sequence: 'zxcv' });

    act(() => render(
      <SequenceIdInput app={app} sequence={drawing.sequences[0]} />,
      container,
    ));

    container.firstChild.value = 'qwer';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);

    expect(drawing.sequences[0].id).toBe('qwer'); // was set
  });

  it('sets the sequence ID on Enter key press', () => {
    let drawing = new DrawingWrapper(app.drawing);
    drawing.appendSequence({ id: 'zxcv', sequence: 'asdf' });

    act(() => render(
      <SequenceIdInput app={app} sequence={drawing.sequences[0]} />,
      container,
    ));

    container.firstChild.value = 'GGG';
    Simulate.change(container.firstChild);
    Simulate.keyUp(container.firstChild, { key: 'Enter' });

    expect(drawing.sequences[0].id).toBe('GGG'); // was set
  });

  it('ignores blank inputs', () => {
    let drawing = new DrawingWrapper(app.drawing);
    drawing.appendSequence({ id: 'ASdf', sequence: 'fdsa' });

    act(() => render(
      <SequenceIdInput app={app} sequence={drawing.sequences[0]} />,
      container,
    ));

    container.firstChild.value = '   ';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);

    expect(drawing.sequences[0].id).toBe('ASdf'); // was not changed
    expect(container.firstChild.value).toBe('ASdf'); // was reset
  });

  it('ignores leading and trailing whitespace', () => {
    let drawing = new DrawingWrapper(app.drawing);
    drawing.appendSequence({ id: 'gghh', sequence: 'ghasdf' });

    act(() => render(
      <SequenceIdInput app={app} sequence={drawing.sequences[0]} />,
      container,
    ));

    container.firstChild.value = '  123    ';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);

    expect(drawing.sequences[0].id).toBe('123'); // was trimmed
  });

  it('ignores inputs equal to the current sequence ID', () => {
    let drawing = new DrawingWrapper(app.drawing);
    drawing.appendSequence({ id: 'zzxcv', sequence: 'qwirj' });

    act(() => render(
      <SequenceIdInput app={app} sequence={drawing.sequences[0]} />,
      container,
    ));

    // should ignore leading and trailing whitespace
    container.firstChild.value = '   zzxcv    ';
    Simulate.change(container.firstChild);
    Simulate.blur(container.firstChild);

    expect(drawing.sequences[0].id).toBe('zzxcv'); // is unchanged
    expect(container.firstChild.value).toBe('zzxcv'); // was reset
  });
});
