import { App } from './App';
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
    app.drawingContainer.childNodes.length
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

test('refresh method', () => {
  let app = new App({ SVG: { SVG: NodeSVG } });
  app.formContainer.refresh = jest.fn();
  app.updateDocumentTitle = jest.fn();
  app.refresh();
  expect(app.formContainer.refresh.mock.calls.length).toBe(1);
  expect(app.updateDocumentTitle.mock.calls.length).toBe(1);
});

it('pushUndo method', () => {
  let app = new App({ SVG: { SVG: NodeSVG } });
  app.strictDrawing.appendSequence('asdf', 'asdf');
  let savableState = app.strictDrawing.savableState();
  app.refresh = jest.fn();
  app.pushUndo();
  expect(
    JSON.stringify(app.undoRedo.peekUndo())
  ).toBe(JSON.stringify(savableState));
  expect(app.refresh.mock.calls.length).toBe(1);
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
    app.undoRedo.undo = jest.fn(() => 'previous state');
    app.strictDrawing.applySavedState = jest.fn();
    app.refresh = jest.fn();
    expect(app.canUndo()).toBeTruthy();
    app.undo();
    expect(app.undoRedo.undo.mock.calls[0][0]).toBe('current state');
    expect(app.strictDrawing.applySavedState.mock.calls[0][0]).toBe('previous state');
    expect(app.refresh.mock.calls.length).toBe(1);
  });

  it('when cannot undo', () => {
    let app = new App({ SVG: { SVG: NodeSVG } });
    app.undoRedo.undo = jest.fn();
    app.strictDrawing.applySavedState = jest.fn();
    app.refresh = jest.fn();
    expect(app.canUndo()).toBeFalsy();
    app.undo();
    expect(app.undoRedo.undo.mock.calls.length).toBe(0);
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
    app.undoRedo.redo = jest.fn(() => 'undone state');
    app.strictDrawing.applySavedState = jest.fn();
    app.refresh = jest.fn();
    expect(app.canRedo()).toBeTruthy();
    app.redo();
    expect(app.undoRedo.redo.mock.calls[0][0]).toBe('current state');
    expect(app.strictDrawing.applySavedState.mock.calls[0][0]).toBe('undone state');
    expect(app.refresh.mock.calls.length).toBe(1);
  });

  it('when cannot redo', () => {
    let app = new App({ SVG: { SVG: NodeSVG } });
    app.undoRedo.redo = jest.fn();
    app.strictDrawing.applySavedState = jest.fn();
    app.refresh = jest.fn();
    expect(app.canRedo()).toBeFalsy();
    app.redo();
    expect(app.undoRedo.redo.mock.calls.length).toBe(0);
    expect(app.strictDrawing.applySavedState.mock.calls.length).toBe(0);
    expect(app.refresh.mock.calls.length).toBe(0);
  });
});

it('refresh method', () => {
  let app = new App({ SVG: { SVG: NodeSVG } });
  let spies = [
    jest.spyOn(app.strictDrawingInteraction, 'refresh'),
  ];
  app.refresh();
  spies.forEach(s => expect(s).toHaveBeenCalled());
});

it('updateDocumentTitle method', () => {
  let app = new App({ SVG: { SVG: NodeSVG } });
  // make sure title is not already RNA2Drawer
  document.title = 'asdf';
  expect(app.drawing.isEmpty()).toBeTruthy();
  app.updateDocumentTitle();
  expect(document.title).toBe('RNA2Drawer');
  appendSequence(app.strictDrawing.drawing, { id: '1123nm', characters: 'asdfQWER' });
  app.updateDocumentTitle();
  expect(document.title).toBe('1123nm');
});
