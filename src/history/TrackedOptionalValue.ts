export type Options<Value> = {
  readonly areEqual: (v1: Value, v2: Value) => boolean;
}

// A tracked value that is optional (i.e., may be undefined).
// (While the current value may be set to undefined, values of
// undefined are not stored in the stacks of previous or next
// values.)
//
// Recommended not to set to null, even though null is considered
// a defined value.
// (This class in principle should always be able to distinguish
// between undefined and null, but it is difficult to thoroughly
// test this.)
export class TrackedOptionalValue<Value> {
  _current?: Value;
  _previousStack: Value[];
  _nextStack: Value[];

  readonly options: Options<Value>;

  constructor(options: Options<Value>) {
    this._previousStack = [];
    this._nextStack = [];

    this.options = options;
  }

  areEqual(v1?: Value, v2?: Value): boolean {
    if (v1 !== undefined && v2 !== undefined) {
      return this.options.areEqual(v1, v2);
    } else if (v1 === undefined && v2 === undefined) {
      return true;
    } else {
      return false;
    }
  }

  get current(): Value | undefined {
    return this._current;
  }

  set current(v: Value | undefined) {
    if (this.areEqual(v, this._current)) {
      // probably safer to still set the current value
      // even though it was already considered equal to the given value
      this._current = v;
      return;
    }

    if (this._current === undefined && this.areEqual(v, this.previous)) {
      this._previousStack.pop();
      // probably safer to set to the given value and not the popped value
      this._current = v;
      return;
    }

    if (this._current !== undefined) {
      this._previousStack.push(this._current);
    }
    if (v !== undefined) {
      this._nextStack = []; // clear the next stack
    }
    this._current = v;
  }

  get previous(): Value | undefined {
    return this._previousStack[this._previousStack.length - 1];
  }

  get next(): Value | undefined {
    return this._nextStack[this._nextStack.length - 1];
  }

  goBackward() {
    let v = this._previousStack.pop();
    if (v !== undefined) {
      if (this._current !== undefined) {
        this._nextStack.push(this._current);
      }
      this._current = v;
    }
  }

  canGoBackward(): boolean {
    return this._previousStack.length > 0;
  }

  goForward() {
    let v = this._nextStack.pop();
    if (v !== undefined) {
      if (this._current !== undefined) {
        this._previousStack.push(this._current);
      }
      this._current = v;
    }
  }

  canGoForward(): boolean {
    return this._nextStack.length > 0;
  }
}
