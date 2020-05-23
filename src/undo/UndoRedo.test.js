import UndoRedo from './UndoRedo';

describe('pushUndo method', () => {
  it('pushes the undo stack', () => {
    let ur = new UndoRedo();
    expect(ur._undoStack.isEmpty()).toBeTruthy();
    ur.pushUndo(2);
    expect(ur._undoStack.size).toBe(1);
    expect(ur._undoStack.peek()).toBe(2);
    ur.pushUndo(5);
    expect(ur._undoStack.size).toBe(2);
    expect(ur._undoStack.peek()).toBe(5);
  });

  it('clears the redo stack', () => {
    let ur = new UndoRedo();
    ur.pushUndo(5);
    ur.pushUndo(6);
    ur.undo(7);
    ur.undo(8);
    expect(ur._redoStack.size).toBe(2);
    ur.pushUndo(1);
    expect(ur._redoStack.isEmpty()).toBeTruthy();
  });
});

it('canUndo method', () => {
  let ur = new UndoRedo();
  expect(ur.canUndo()).toBeFalsy();
  ur.pushUndo(2);
  expect(ur.canUndo()).toBeTruthy();
  ur.undo(5);
  expect(ur.canUndo()).toBeFalsy();
});

describe('undo method', () => {
  it('when cannot undo', () => {
    let ur = new UndoRedo();
    ur.pushUndo(6);
    ur.pushUndo(7);
    ur.undo(8);
    ur.undo(9);
    expect(ur.canUndo()).toBeFalsy();
    expect(ur._redoStack.size).toBe(2);
    expect(ur.undo(5)).toBe(5); // returns passed element
    expect(ur._undoStack.isEmpty()).toBeTruthy(); // does not change undo stack
    expect(ur._redoStack.size).toBe(2); // does not change redo stack
  });

  it('pushes the redo stack with the passed element', () => {
    let ur = new UndoRedo();
    ur.pushUndo(8);
    ur.undo(9);
    expect(ur._redoStack.peek()).toBe(9);
  });

  it('pops the undo stack and returns the popped element', () => {
    let ur = new UndoRedo();
    ur.pushUndo(10);
    ur.pushUndo(11);
    expect(ur._undoStack.size).toBe(2);
    expect(ur.undo(12)).toBe(11);
    expect(ur._undoStack.size).toBe(1);
  });
});

it('canRedo method', () => {
  let ur = new UndoRedo();
  expect(ur.canRedo()).toBeFalsy();
  ur.pushUndo(12);
  ur.undo(15);
  expect(ur.canRedo()).toBeTruthy();
  ur.pushUndo(18);
  expect(ur.canRedo()).toBeFalsy();
});

describe('redo method', () => {
  it('when cannot redo', () => {
    let ur = new UndoRedo();
    ur.pushUndo(20);
    ur.pushUndo(21);
    expect(ur.canRedo()).toBeFalsy();
    expect(ur._undoStack.size).toBe(2);
    expect(ur.redo(30)).toBe(30); // returns the passed element
    expect(ur._undoStack.size).toBe(2); // does not change undo stack
    expect(ur._redoStack.isEmpty()).toBeTruthy(); // does not change redo stack
  });

  it('pushes the undo stack with the passed element', () => {
    let ur = new UndoRedo();
    ur.pushUndo(8);
    ur.pushUndo(9);
    ur.undo(10);
    ur.redo(11);
    expect(ur._undoStack.size).toBe(2);
    expect(ur._undoStack.peek()).toBe(11);
  });

  it('pops the redo stack and returns the popped element', () => {
    let ur = new UndoRedo();
    ur.pushUndo(15);
    ur.pushUndo(16);
    ur.undo(18);
    ur.undo(19);
    expect(ur.redo(20)).toBe(19);
    expect(ur._redoStack.size).toBe(1);
  });
});
