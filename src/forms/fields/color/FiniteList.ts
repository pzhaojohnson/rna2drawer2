export class FiniteList<T> {
  _values: T[];
  readonly maxLength: number;

  constructor(maxLength: number) {
    this._values = [];
    this.maxLength = maxLength;
  }

  push(v: T) {
    this._values.push(v);
    if (this._values.length > this.maxLength) {
      this._values = this._values.slice(-this.maxLength);
    }
  }

  values(): T[] {
    return [...this._values];
  }
}
