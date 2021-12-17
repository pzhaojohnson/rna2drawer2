import App from './App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import React from 'react';
import ReactDOM from 'react-dom';
import { Menu } from './menu/Menu';
import { Infobar } from './infobar/Infobar';

it('renders', () => {
  new App({ SVG: { SVG: NodeSVG } });
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

describe('drawingTitle property and unspecifyDrawingTitle method', () => {
  it('when drawing is empty', () => {
    let app = new App({ SVG: { SVG: NodeSVG } });
    expect(app.strictDrawing.isEmpty()).toBeTruthy();
    expect(app.drawingTitle).toBeFalsy(); // has not been set
    app.drawingTitle = 'A Truthy Title';
    expect(app.drawingTitle).toBe('A Truthy Title'); // can be set
    app.unspecifyDrawingTitle();
    expect(app.drawingTitle).toBeFalsy(); // can be unspecified
  });

  it('when drawing is not empty', () => {
    let app = new App({ SVG: { SVG: NodeSVG } });
    app.strictDrawing.appendSequence('asdf', 'asdfasdf');
    app.strictDrawing.appendSequence('qwer', 'qwerqwer');
    app.strictDrawing.appendSequence('zxcv', 'zxcvzxcv');
    expect(app.drawingTitle).toBe('asdf, qwer, zxcv'); // has not been set
    app.drawingTitle = 'Not the sequence IDs';
    expect(app.drawingTitle).toBe('Not the sequence IDs'); // can be set
    app.unspecifyDrawingTitle();
    expect(app.drawingTitle).toBe('asdf, qwer, zxcv'); // can be unspecified
  });

  it('updates peripherals', () => {
    let app = new App({ SVG: { SVG: NodeSVG } });
    app.renderForm(() => <p>{app.drawingTitle}</p>);
    app.drawingTitle = 'asdf QWER';
    expect(document.title).toBe('asdf QWER');
    expect(app._formContainer.textContent).toMatch(/asdf QWER/);
    app.unspecifyDrawingTitle();
    expect(app.drawingTitle).toBe(''); // drawing has no title
    expect(document.title).toBe('RNA2Drawer');
    expect(app._formContainer.textContent).toBe('');
    app.strictDrawing.appendSequence('qwer', 'qwerqwer');
    app.strictDrawing.appendSequence('asdf', 'asdfasdf');
    app.drawingTitle = 'zz GB NM';
    expect(document.title).toBe('zz GB NM');
    expect(app._formContainer.textContent).toMatch(/zz GB NM/);
    app.unspecifyDrawingTitle();
    expect(document.title).toBe('qwer, asdf');
    expect(app._formContainer.textContent).toMatch(/qwer, asdf/);
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
