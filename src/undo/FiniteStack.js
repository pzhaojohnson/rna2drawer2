class FiniteStack {
  constructor() {
    this._stack = [];
    this._sizeLimit = 60;
    this._sizeLimitWasExceeded = false;
  }

  /**
   * Pushes the given element onto the top of this finite stack. If doing so exceeds
   * the size limit of this finite stack, then the bottom element of this finite stack
   * is removed.
   * 
   * @param {*} ele 
   */
  push(ele) {
    this._stack.push(ele);
    if (this._stack.length > this._sizeLimit) {
      this._stack.shift();
      this._sizeLimitWasExceeded = true;
    }
  }

  /**
   * Pops the top element off of this finite stack and returns it.
   * 
   * @returns {*} The popped element, or null if this finite stack is empty.
   */
  pop() {
    if (this.isEmpty()) {
      return null;
    } else {
      return this._stack.pop();
    }
  }

  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this._stack[this.size - 1];
  }

  clear() {
    this._stack = [];
  }

  /**
   * @returns {number} 
   */
  get size() {
    return this._stack.length;
  }

  /**
   * @returns {boolean} 
   */
  isEmpty() {
    return this.size == 0;
  }

  /**
   * @returns {number} The maximum number of elements allowed in this finite stack.
   */
  get sizeLimit() {
    return this._sizeLimit;
  }

  /**
   * @returns {boolean} True if the size limit of this finite stack was ever exceeded.
   */
  sizeLimitWasExceeded() {
    return this._sizeLimitWasExceeded;
  }
}

export default FiniteStack;
