import FiniteStack from './FiniteStack';

class UndoRedo<E> {
  _undoStack: FiniteStack;
  _redoStack: FiniteStack;

  constructor() {
    this._undoStack = new FiniteStack();
    this._redoStack = new FiniteStack();
  }

  pushUndo(ele: E) {
    this._undoStack.push(ele);
    this._redoStack.clear();
  }

  canUndo(): boolean {
    return !this._undoStack.isEmpty();
  }

  peekUndo(): E {
    return this._undoStack.peek();
  }

  /**
   * If the undo stack is empty when this method is called,
   * then the passed element is returned and the undo and
   * redo stacks are unaffected.
   * 
   * @param ele The element to push onto the redo stack.
   */
  undo(ele: E): E {
    if (!this.canUndo()) {
      return ele;
    }
    this._redoStack.push(ele);
    return this._undoStack.pop();
  }

  canRedo(): boolean {
    return !this._redoStack.isEmpty();
  }

  peekRedo(): E {
    return this._redoStack.peek();
  }

  /**
   * If the redo stack is empty when this method is called,
   * then the passed element is returned and the undo and
   * redo stacks are unaffected.
   * 
   * @param ele The element to push onto the undo stack.
   */
  redo(ele: E): E {
    if (!this.canRedo()) {
      return ele;
    }
    this._undoStack.push(ele);
    return this._redoStack.pop();
  }
}

export default UndoRedo;
