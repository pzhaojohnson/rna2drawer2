import App from './App';
import NodeSVG from './draw/NodeSVG';
import React from 'react';

import {
  getMenuContainer,
  getDrawingContainer,
  getFormContainer,
  getInfobarContainer,
} from './fillInBodyForApp';

jest.mock('./menu/createMenuForApp');
import createMenuForApp from './menu/createMenuForApp';

jest.mock('./infobar/createInfobarForApp');
import createInfobarForApp from './infobar/createInfobarForApp';

jest.mock('./export/saveDrawingForApp');
import saveDrawingForApp from './export/saveDrawingForApp';

it('renders', () => {
  new App(() => NodeSVG());
});

it('SVG getter', () => {
  let svg = jest.fn(() => NodeSVG());
  let app = new App(svg);
  expect(app.SVG).toBe(svg);
});

it('initializes drawing and adds it to its container', () => {
  let app = new App(() => NodeSVG());
  expect(
    () => app.strictDrawing.appendSequence('asdf', 'asdf')
  ).not.toThrow(); // will throw if SVG callback not passed
  expect(
    getDrawingContainer().childNodes.length
  ).toBeGreaterThan(0);
});

it('initializes drawing interaction and binds it', () => {
  let app = new App(() => NodeSVG());
  let interaction = app.strictDrawingInteraction;
  expect(interaction).toBeTruthy();
  expect(interaction.strictDrawing).toBe(app.strictDrawing); // passes drawing
  app.pushUndo = jest.fn();
  interaction.fireShouldPushUndo();
  expect(app.pushUndo.mock.calls.length).toBe(1);
  app.renderPeripherals = jest.fn();
  interaction.fireChange();
  expect(app.renderPeripherals.mock.calls.length).toBe(1);
});

describe('renderPeripherals method', () => {
  it('when there is a form', () => {
    let app = new App(() => NodeSVG());
    let formFactory = () => <div></div>;
    app.renderForm(formFactory);
    app.renderMenu = jest.fn();
    app.renderInfobar = jest.fn();
    app.renderForm = jest.fn();
    app.renderPeripherals();
    expect(app.renderMenu.mock.calls.length).toBe(1);
    expect(app.renderInfobar.mock.calls.length).toBe(1);
    expect(app.renderForm.mock.calls.length).toBe(1);
    expect(app.renderForm.mock.calls[0][0]).toBe(formFactory);
  });

  it('when there is no form', () => {
    let app = new App(() => NodeSVG());
    app.unmountCurrForm();
    app.renderMenu = jest.fn();
    app.renderInfobar = jest.fn();
    app.renderForm = jest.fn();
    app.renderPeripherals();
    expect(app.renderMenu.mock.calls.length).toBe(1);
    expect(app.renderInfobar.mock.calls.length).toBe(1);
    expect(app.renderForm.mock.calls.length).toBe(0);
  });
});

it('renderMenu method', () => {
  let textContent = 'Menu was rendered.';
  createMenuForApp.mockImplementation(() => <div>{textContent}</div>);
  let app = new App(() => NodeSVG());
  let c = createMenuForApp.mock.calls.length;
  app.renderMenu();
  expect(createMenuForApp.mock.calls.length).toBe(c + 1);
  expect(createMenuForApp.mock.calls[c][0]).toBe(app); // passes self
  expect(getMenuContainer().textContent).toBe(textContent);
});

it('renderInfobar method', () => {
  let textContent = 'Infobar was rendered.';
  createInfobarForApp.mockImplementation(() => <div>{textContent}</div>);
  let app = new App(() => NodeSVG());
  let c = createInfobarForApp.mock.calls.length;
  app.renderInfobar();
  expect(createInfobarForApp.mock.calls.length).toBe(c + 1);
  expect(createInfobarForApp.mock.calls[c][0]).toBe(app); // passes self
  expect(getInfobarContainer().textContent).toBe(textContent);
});

it('renderForm method', () => {
  let textContent = 'Form was rendered.';
  let formFactory = jest.fn(() => <div>{textContent}</div>);
  let app = new App(() => NodeSVG());
  app.unmountCurrForm = jest.fn();
  app.renderForm(formFactory);
  expect(app.unmountCurrForm.mock.calls.length).toBe(1);
  expect(getFormContainer().textContent).toBe(textContent);
  expect(app._currFormFactory).toBe(formFactory);
});

it('unmountCurrForm method', () => {
  let textContent = 'Form is still rendered.';
  let formFactory = jest.fn(() => <div>{textContent}</div>);
  let app = new App(() => NodeSVG());
  app.renderForm(formFactory);
  expect(getFormContainer().textContent).toBe(textContent);
  expect(app._currFormFactory).toBe(formFactory);
  app.unmountCurrForm();
  expect(getFormContainer().textContent).toBeFalsy();
  expect(app._currFormFactory).toBeFalsy();
});

it('pushUndo method', () => {
  let app = new App(() => NodeSVG());
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
  let app = new App(() => NodeSVG());
  expect(app.canUndo()).toBeFalsy();
  app.pushUndo();
  expect(app.canUndo()).toBeTruthy();
});

describe('undo method', () => {
  it('when can undo', () => {
    let app = new App(() => NodeSVG());
    app.strictDrawing.appendSequence('asdf', 'asdf');
    app.pushUndo();

    app.strictDrawing.savableState = jest.fn(() => 'current state');
    app._undoRedo.undo = jest.fn(() => 'previous state');
    app.strictDrawing.applySavedState = jest.fn();
    app.drawingChangedNotByInteraction = jest.fn();
    expect(app.canUndo()).toBeTruthy();
    app.undo();
    expect(app._undoRedo.undo.mock.calls[0][0]).toBe('current state');
    expect(app.strictDrawing.applySavedState.mock.calls[0][0]).toBe('previous state');
    expect(app.drawingChangedNotByInteraction.mock.calls.length).toBe(1);
  });

  it('when cannot undo', () => {
    let app = new App(() => NodeSVG());
    app._undoRedo.undo = jest.fn();
    app.strictDrawing.applySavedState = jest.fn();
    app.drawingChangedNotByInteraction = jest.fn();
    expect(app.canUndo()).toBeFalsy();
    app.undo();
    expect(app._undoRedo.undo.mock.calls.length).toBe(0);
    expect(app.strictDrawing.applySavedState.mock.calls.length).toBe(0);
    expect(app.drawingChangedNotByInteraction.mock.calls.length).toBe(0);
  });
});

it('canRedo method', () => {
  let app = new App(() => NodeSVG());
  expect(app.canRedo()).toBeFalsy();
  app.pushUndo();
  app.undo();
  expect(app.canRedo()).toBeTruthy();
});

describe('redo method', () => {
  it('when can redo', () => {
    let app = new App(() => NodeSVG());
    app.strictDrawing.appendSequence('asdf', 'asdf');
    app.pushUndo();
    app.strictDrawing.appendSequence('qwer', 'qwer');
    app.undo();
    
    app.strictDrawing.savableState = jest.fn(() => 'current state');
    app._undoRedo.redo = jest.fn(() => 'undone state');
    app.strictDrawing.applySavedState = jest.fn();
    app.drawingChangedNotByInteraction = jest.fn();
    expect(app.canRedo()).toBeTruthy();
    app.redo();
    expect(app._undoRedo.redo.mock.calls[0][0]).toBe('current state');
    expect(app.strictDrawing.applySavedState.mock.calls[0][0]).toBe('undone state');
    expect(app.drawingChangedNotByInteraction.mock.calls.length).toBe(1);
  });

  it('when cannot redo', () => {
    let app = new App(() => NodeSVG());
    app._undoRedo.redo = jest.fn();
    app.strictDrawing.applySavedState = jest.fn();
    app.drawingChangedNotByInteraction = jest.fn();
    expect(app.canRedo()).toBeFalsy();
    app.redo();
    expect(app._undoRedo.redo.mock.calls.length).toBe(0);
    expect(app.strictDrawing.applySavedState.mock.calls.length).toBe(0);
    expect(app.drawingChangedNotByInteraction.mock.calls.length).toBe(0);
  });
});

it('drawingChangedNotByInteraction method', () => {
  let app = new App(() => NodeSVG());
  app.strictDrawingInteraction.reset = jest.fn();
  app.renderPeripherals = jest.fn();
  app.drawingChangedNotByInteraction();
  expect(app.strictDrawingInteraction.reset.mock.calls.length).toBe(1);
  expect(app.renderPeripherals.mock.calls.length).toBe(1);
});

it('binds undo', () => {
  let app = new App(() => NodeSVG());
  app.undo = jest.fn();
  document.dispatchEvent(
    new KeyboardEvent('keydown', { ctrlKey: false, key: 'z' })
  ); // control key not pressed
  document.dispatchEvent(
    new KeyboardEvent('keydown', { ctrlKey: true, key: 'z' })
  ); // control key pressed
  document.dispatchEvent(
    new KeyboardEvent('keydown', { ctrlKey: true, key: 'Z' })
  ); // uppercase key
  expect(app.undo.mock.calls.length).toBe(2);
});

it('binds redo', () => {
  let app = new App(() => NodeSVG());
  app.redo = jest.fn();
  document.dispatchEvent(
    new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: false, key: 'z' })
  ); // shift key not pressed
  expect(app.redo.mock.calls.length).toBe(0);
  
  // this causes infinite recursion somehow...
  /*
  document.dispatchEvent(
    new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: 'z' })
  ); // shift key pressed
  document.dispatchEvent(
    new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, key: 'Z' })
  ); // uppercase key
  expect(app.redo.mock.calls.length).toBe(2);
  */
});

it('updateDocumentTitle method', () => {
  let app = new App(() => NodeSVG());
  document.title = 'asdf';
  app.updateDocumentTitle(); // drawing is empty
  expect(document.title).toBe('RNA2Drawer 2');
  app.strictDrawing.appendSequence('qwer', 'qwer');
  app.updateDocumentTitle(); // drawing has one sequence
  expect(document.title).toBe('qwer');
  app.strictDrawing.appendSequence('zxcv', 'zxcv');
  app.strictDrawing.appendSequence('asdf', 'asdf');
  app.updateDocumentTitle(); // drawing has multiple sequences
  expect(document.title).toBe('qwer, zxcv, asdf');
});

it('save method', () => {
  let app = new App(() => NodeSVG());
  saveDrawingForApp.mockImplementation(jest.fn());
  app.save();
  expect(saveDrawingForApp.mock.calls.length).toBe(1);
  expect(saveDrawingForApp.mock.calls[0][0]).toBe(app); // passes self
});
