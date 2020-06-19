class FiniteStack<E> {
  _stack: Array<E>;
  _sizeLimit: number;
  _sizeLimitWasExceeded: boolean;

  constructor() {
    this._stack = [];
    this._sizeLimit = 60;
    this._sizeLimitWasExceeded = false;
  }

  /**
   * If pushing the stack exceeds the size limit, then the bottom element
   * of the stack is removed and discarded.
   */
  push(ele: E) {
    this._stack.push(ele);
    if (this._stack.length > this._sizeLimit) {
      this._stack.shift();
      this._sizeLimitWasExceeded = true;
    }
  }

  pop(): E | undefined {
    return this._stack.pop();
  }

  peek(): E | undefined {
    return this._stack[this.size - 1];
  }

  clear() {
    this._stack = [];
  }

  get size(): number {
    return this._stack.length;
  }

  isEmpty(): boolean {
    return this.size == 0;
  }

  get sizeLimit(): number {
    return this._sizeLimit;
  }

  sizeLimitWasExceeded(): boolean {
    return this._sizeLimitWasExceeded;
  }
}

export default FiniteStack;
