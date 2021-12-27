export type Options = {
  maxLength: number;
}

export class FiniteList<T> {
  _elements: T[];
  readonly maxLength: number;

  constructor(options: Options) {
    this._elements = [];
    this.maxLength = options.maxLength;
  }

  // returns a new array of the elements in the list
  // in the order that they are present in the list
  elements(): T[] {
    return [...this._elements];
  }

  // the number of elements in the list
  get length(): number {
    return this._elements.length;
  }

  // the number of elements in the list
  // (an alias for the length property)
  get size(): number {
    return this.length;
  }

  // appends the given element to the end of the list
  // and removes the first element from the list if
  // the list is already its maximum length
  push(ele: T) {
    // length should never be greater than the maximum length
    // but just in case...
    if (this._elements.length >= this.maxLength) {
      this._elements.shift();
    }
    this._elements.push(ele);
  }

  // pops the last element from the list and returns it
  // or returns undefined for an empty list
  pop(): T | undefined {
    return this._elements.pop();
  }

  // returns the last element of the list
  // or undefined for an empty list
  get last(): T | undefined {
    return this._elements[this._elements.length - 1];
  }
}
