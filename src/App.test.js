import App from './App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import React from 'react';
import ReactDOM from 'react-dom';
import { Menu } from './menu/Menu';
import { Infobar } from './infobar/Infobar';
import { appendSequence } from 'Draw/sequences/add/sequence';

it('renders', () => {
  new App({ SVG: { SVG: NodeSVG } });
});

test('node property', () => {
  let app = new App({ SVG: { SVG: NodeSVG } });
  // should contain everything
  expect(app.node.contains(app.strictDrawing.node)).toBeTruthy();
});

it('initializes drawing and adds it to its container', () => {
  let app = new App({ SVG: { SVG: NodeSVG } });
  expect(
    () => app.strictDrawing.appendSequence('asdf', 'asdf')
  ).not.toThrow(); // will throw if SVG callback not passed
  expect(
    app._drawingContainer.childNodes.length
  ).toBeGreaterThan(0);
});

test('appendTo and remove methods', () => {
  let app = new App({ SVG: { SVG: NodeSVG } });
  let container = document.createElement('div');
  let siblings = [document.createElement('div'), document.createElement('div')];
  siblings.forEach(sibling => container.appendChild(sibling));
  expect(container.contains(app.node)).toBeFalsy();
  app.appendTo(container);
  expect(container.lastChild).toBe(app.node); // appended to end
  app.remove();
  expect(container.contains(app.node)).toBeFalsy(); // was removed
});

describe('renderPeripherals method', () => {
  it('when there is a form', () => {
    let app = new App({ SVG: { SVG: NodeSVG } });
    let formFactory = () => <div></div>;
    app.renderForm(formFactory);
    app.renderMenu = jest.fn();
    app.renderInfobar = jest.fn();
    app.renderForm = jest.fn();
    app.updateDocumentTitle = jest.fn();
    app.renderPeripherals();
    expect(app.renderMenu.mock.calls.length).toBe(1);
    expect(app.renderInfobar.mock.calls.length).toBe(1);
    expect(app.renderForm.mock.calls.length).toBe(1);
    expect(app.renderForm.mock.calls[0][0]).toBe(formFactory);
    expect(app.updateDocumentTitle.mock.calls.length).toBe(1);
  });

  it('when there is no form', () => {
    let app = new App({ SVG: { SVG: NodeSVG } });
    app.unmountForm();
    app.renderMenu = jest.fn();
    app.renderInfobar = jest.fn();
    app.renderForm = jest.fn();
    app.updateDocumentTitle = jest.fn();
    app.renderPeripherals();
    expect(app.renderMenu.mock.calls.length).toBe(1);
    expect(app.renderInfobar.mock.calls.length).toBe(1);
    expect(app.renderForm.mock.calls.length).toBe(0);
    expect(app.updateDocumentTitle.mock.calls.length).toBe(1);
  });
});

it('renderForm method', () => {
  let textContent = 'Form was rendered.';
  let formFactory = () => <div>{textContent}</div>;
  let app = new App({ SVG: { SVG: NodeSVG } });
  app.renderForm(formFactory);
  expect(app._formContainer.textContent).toBe(textContent);
  expect(app._formFactory).toBe(formFactory);
});

it('unmountForm method', () => {
  let textContent = 'Form is still rendered.';
  let formFactory = () => <div>{textContent}</div>;
  let app = new App({ SVG: { SVG: NodeSVG } });
  app.renderForm(formFactory);
  expect(app._formContainer.textContent).toBe(textContent);
  expect(app._formFactory).toBe(formFactory);
  app.unmountForm();
  expect(app._formContainer.textContent).toBeFalsy();
  expect(app._formFactory).toBeFalsy();
});

it('pushUndo method', () => {
  let app = new App({ SVG: { SVG: NodeSVG } });
  app.strictDrawing.appendSequence('asdf', 'asdf');
  let savableState = app.strictDrawing.savableState();
  app.renderPeripherals = jest.fn();
  app.pushUndo();
  expect(
    JSON.stringify(app._undoRedo.peekUndo())
  ).toBe(JSON.stringify(savableState));
  expect(app.renderPeripherals.mock.calls.length).toBe(1);
});

it('canUndo method', () => {
  let app = new App({ SVG: { SVG: NodeSVG } });
  expect(app.canUndo()).toBeFalsy();
  app.pushUndo();
  expect(app.canUndo()).toBeTruthy();
});

describe('undo method', () => {
  it('when can undo', () => {
    let app = new App({ SVG: { SVG: NodeSVG } });
    app.strictDrawing.appendSequence('asdf', 'asdf');
    app.pushUndo();

    app.strictDrawing.savableState = jest.fn(() => 'current state');
    app._undoRedo.undo = jest.fn(() => 'previous state');
    app.strictDrawing.applySavedState = jest.fn();
    app.refresh = jest.fn();
    expect(app.canUndo()).toBeTruthy();
    app.undo();
    expect(app._undoRedo.undo.mock.calls[0][0]).toBe('current state');
    expect(app.strictDrawing.applySavedState.mock.calls[0][0]).toBe('previous state');
    expect(app.refresh.mock.calls.length).toBe(1);
  });

  it('when cannot undo', () => {
    let app = new App({ SVG: { SVG: NodeSVG } });
    app._undoRedo.undo = jest.fn();
    app.strictDrawing.applySavedState = jest.fn();
    app.refresh = jest.fn();
    expect(app.canUndo()).toBeFalsy();
    app.undo();
    expect(app._undoRedo.undo.mock.calls.length).toBe(0);
    expect(app.strictDrawing.applySavedState.mock.calls.length).toBe(0);
    expect(app.refresh.mock.calls.length).toBe(0);
  });
});

it('canRedo method', () => {
  let app = new App({ SVG: { SVG: NodeSVG } });
  expect(app.canRedo()).toBeFalsy();
  app.pushUndo();
  app.undo();
  expect(app.canRedo()).toBeTruthy();
});

describe('redo method', () => {
  it('when can redo', () => {
    let app = new App({ SVG: { SVG: NodeSVG } });
    app.strictDrawing.appendSequence('asdf', 'asdf');
    app.pushUndo();
    app.strictDrawing.appendSequence('qwer', 'qwer');
    app.undo();

    app.strictDrawing.savableState = jest.fn(() => 'current state');
    app._undoRedo.redo = jest.fn(() => 'undone state');
    app.strictDrawing.applySavedState = jest.fn();
    app.refresh = jest.fn();
    expect(app.canRedo()).toBeTruthy();
    app.redo();
    expect(app._undoRedo.redo.mock.calls[0][0]).toBe('current state');
    expect(app.strictDrawing.applySavedState.mock.calls[0][0]).toBe('undone state');
    expect(app.refresh.mock.calls.length).toBe(1);
  });

  it('when cannot redo', () => {
    let app = new App({ SVG: { SVG: NodeSVG } });
    app._undoRedo.redo = jest.fn();
    app.strictDrawing.applySavedState = jest.fn();
    app.refresh = jest.fn();
    expect(app.canRedo()).toBeFalsy();
    app.redo();
    expect(app._undoRedo.redo.mock.calls.length).toBe(0);
    expect(app.strictDrawing.applySavedState.mock.calls.length).toBe(0);
    expect(app.refresh.mock.calls.length).toBe(0);
  });
});

it('refresh method', () => {
  let app = new App({ SVG: { SVG: NodeSVG } });
  let spies = [
    jest.spyOn(app.strictDrawingInteraction, 'refresh'),
    jest.spyOn(app, 'renderPeripherals'),
  ];
  app.refresh();
  spies.forEach(s => expect(s).toHaveBeenCalled());
});

describe('unspecifiedDrawingTitle method', () => {
  test('when the drawing is empty', () => {
    let app = new App({ SVG: { SVG: NodeSVG } });
    expect(app.strictDrawing.isEmpty()).toBeTruthy();
    expect(app.unspecifiedDrawingTitle()).toBe('');
  });

  describe('when the drawing is not empty', () => {
    test('when there is one sequence', () => {
      let app = new App({ SVG: { SVG: NodeSVG } });
      appendSequence(app.strictDrawing.drawing, { id: 'ASDFasdf', characters: 'asDFFDsa' });
      expect(app.strictDrawing.drawing.sequences.length).toBe(1);
      expect(app.unspecifiedDrawingTitle()).toBe('ASDFasdf');
    });

    test('when there are multiple sequences', () => {
      let app = new App({ SVG: { SVG: NodeSVG } });
      appendSequence(app.strictDrawing.drawing, { id: 'QWER', characters: 'qwerqwer' });
      appendSequence(app.strictDrawing.drawing, { id: 'A', characters: 'B' });
      appendSequence(app.strictDrawing.drawing, { id: 'z x C V', characters: 'zxcv ZXCV' });
      expect(app.strictDrawing.drawing.sequences.length).toBe(3);
      expect(app.unspecifiedDrawingTitle()).toBe('QWER, A, z x C V');
    });

    test('when a sequence has an empty ID', () => {
      let app = new App({ SVG: { SVG: NodeSVG } });
      appendSequence(app.strictDrawing.drawing, { id: '', characters: 'asdf' });
      expect(app.strictDrawing.drawing.sequences.length).toBe(1);
      expect(app.unspecifiedDrawingTitle()).toBe('');
    });
  });
});

describe('drawingTitle property and unspecifyDrawingTitle method', () => {
  test('when the drawing is empty', () => {
    let app = new App({ SVG: { SVG: NodeSVG } });
    expect(app.strictDrawing.isEmpty()).toBeTruthy();
    expect(app.drawingTitle).toBe('');
    app.drawingTitle = 'ASDF asdf'; // specify
    expect(app.drawingTitle).toBe('ASDF asdf');
    expect(document.title).toBe('ASDF asdf'); // updated the document title
    app.unspecifyDrawingTitle();
    expect(app.drawingTitle).toBe(''); // was unspecified
    expect(document.title).not.toBe('ASDF asdf'); // updated the document title
  });

  test('when the drawing is not empty', () => {
    let app = new App({ SVG: { SVG: NodeSVG } });
    appendSequence(app.strictDrawing.drawing, { id: 'asDF', characters: 'asdfasdf' });
    appendSequence(app.strictDrawing.drawing, { id: 'qw er', characters: 'qwerqwer' });
    appendSequence(app.strictDrawing.drawing, { id: 'Z', characters: 'zxcvzxcv' });
    expect(app.strictDrawing.drawing.sequences.length).toBe(3);
    expect(app.unspecifiedDrawingTitle()).toBe('asDF, qw er, Z');
    expect(app.drawingTitle).toBe('asDF, qw er, Z'); // returns the unspecified title
    app.drawingTitle = 'Another Title';
    expect(app.drawingTitle).toBe('Another Title'); // was specified
    expect(document.title).toBe('Another Title'); // updated the document title
    app.unspecifyDrawingTitle();
    expect(app.drawingTitle).toBe('asDF, qw er, Z'); // was unspecified
    expect(document.title).toBe('asDF, qw er, Z'); // updated the document title
  });
});

it('updateDocumentTitle method', () => {
  let app = new App({ SVG: { SVG: NodeSVG } });
  // make sure title is not already RNA2Drawer
  document.title = 'asdf';
  expect(app.drawingTitle).toBeFalsy(); // drawing has no title
  app.updateDocumentTitle();
  expect(document.title).toBe('RNA2Drawer');
  app.drawingTitle = 'Title of Drawing'; // drawing has a title
  app.updateDocumentTitle();
  expect(document.title).toBe('Title of Drawing');
});
