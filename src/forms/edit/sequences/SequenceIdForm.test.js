import { App } from 'App';

import * as SVG from 'Draw/svg/NodeSVG';

import { appendSequence } from 'Draw/sequences/add/sequence';

import * as React from 'react';
import { act } from 'react-dom/test-utils';

import { SequenceIdForm } from './SequenceIdForm';

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

beforeEach(() => {
  app = new App({ SVG });
  app.appendTo(document.body);
});

afterEach(() => {
  app.remove();
  app = null;
});

describe('SequenceIdForm component', () => {
  test('when the drawing of the app has no sequences', () => {
    expect(app.drawing.sequences.length).toBe(0);

    act(() => app.formContainer.renderForm(props => (
      <SequenceIdForm {...props} app={app} />
    )));

    let textContent = app.formContainer.node.textContent;
    expect(textContent).toMatch('Drawing has no sequences.');

    // did not render input element
    let inputs = app.formContainer.node.getElementsByTagName('input');
    expect(inputs.length).toBe(0);
  });

  test('when the drawing of the app has one sequence', () => {
    let drawing = new DrawingWrapper(app.drawing);
    drawing.appendSequence({ id: 'asdf', sequence: 'FDSA' });
    expect(drawing.sequences.length).toBe(1);

    act(() => app.formContainer.renderForm(props => (
      <SequenceIdForm {...props} app={app} />
    )));

    let textContent = app.formContainer.node.textContent;
    expect(textContent).not.toMatch('Drawing has no sequences.');

    // rendered input element
    let inputs = app.formContainer.node.getElementsByTagName('input');
    expect(inputs.length).toBe(1);
    expect(inputs[0].value).toMatch('asdf');
  });

  test('when the drawing of the app has multiple sequences', () => {
    let drawing = new DrawingWrapper(app.drawing);
    drawing.appendSequence({ id: '123', sequence: 'AAA' });
    drawing.appendSequence({ id: 'qwer', sequence: 'QWER' });
    drawing.appendSequence({ id: 'zzz', sequence: 'xxx' });
    expect(drawing.sequences.length).toBe(3);

    act(() => app.formContainer.renderForm(props => (
      <SequenceIdForm {...props} app={app} />
    )));

    let textContent = app.formContainer.node.textContent;
    expect(textContent).not.toMatch('Drawing has no sequences.');

    // rendered input element
    let inputs = app.formContainer.node.getElementsByTagName('input');
    expect(inputs.length).toBe(1);
    expect(inputs[0].value).toBe('123'); // just the first sequence ID
  });
});
