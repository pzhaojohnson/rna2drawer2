import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import createNodeSVG from './draw/createNodeSVG';

it('renders', () => {
  new App(() => createNodeSVG());
});

describe('pushUndo method', () => {
  it('pushes undo stack and clears redo stack', () => {
    let app = new App(() => createNodeSVG());
    let sd = app.strictDrawing;
    sd.appendSequence('asdf', 'asdf');
    app.pushUndo();
    sd.appendSequence('qwer', 'qwer');
    app.pushUndo();
    sd.appendSequence('zxcv', 'zxcv');
    app.undo();
    app.undo();
    expect(app._undoStack.isEmpty()).toBeTruthy();
    expect(app._redoStack.isEmpty()).toBeFalsy();
    let savedState = sd.savableState();
    app.pushUndo();
    expect(
      JSON.stringify(app._undoStack.peek())
    ).toBe(JSON.stringify(savedState));
    expect(app._redoStack.isEmpty()).toBeTruthy();
  });
});

describe('undo method', () => {
  it('returns early when cannot undo', () => {
    let app = new App(() => createNodeSVG());
    expect(app.canUndo()).toBeFalsy();
    expect(() => app.undo()).not.toThrow();
  });

  it('pops undo stack, applies saved state and pushes redo stack', () => {
    let app = new App(() => createNodeSVG());
    let sd = app.strictDrawing;
    sd.appendSequence('asdf', 'asdf');
    let savedState1 = sd.savableState();
    app.pushUndo();
    sd.appendSequence('qwer', 'qwer');
    let savedState2 = sd.savableState();
    app.undo();
    expect(app._undoStack.isEmpty()).toBeTruthy();
    expect(
      JSON.stringify(sd.savableState())
    ).toBe(JSON.stringify(savedState1));
    expect(
      JSON.stringify(app._redoStack.peek())
    ).toBe(JSON.stringify(savedState2));
  });
});

describe('redo method', () => {
  it('returns early when cannot redo', () => {
    let app = new App(() => createNodeSVG());
    expect(app.canRedo()).toBeFalsy();
    expect(() => app.redo()).not.toThrow();
  });

  it('pops redo stack, applies saved state and pushes undo stack', () => {
    let app = new App(() => createNodeSVG());
    let sd = app.strictDrawing;
    sd.appendSequence('asdf', 'asdf');
    let savedState1 = sd.savableState();
    app.pushUndo();
    sd.appendSequence('qwer', 'qwer');
    let savedState2 = sd.savableState();
    app.undo();
    app.redo();
    expect(
      JSON.stringify(app._undoStack.peek())
    ).toBe(JSON.stringify(savedState1));
    expect(
      JSON.stringify(sd.savableState())
    ).toBe(JSON.stringify(savedState2));
    expect(app._redoStack.isEmpty()).toBeTruthy();
  });
});
