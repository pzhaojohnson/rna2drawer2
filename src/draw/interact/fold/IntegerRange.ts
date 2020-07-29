export class IntegerRange {
  _start: number;
  _end: number;

  /**
   * It is undefined what happens when start is greater than end,
   * or when start or end are not integers.
   */
  constructor(start: number, end: number) {
    this._start = start;
    this._end = end;
  }

  get start(): number {
    return this._start;
  }

  get end(): number {
    return this._end;
  }

  contains(v: (number | IntegerRange)): boolean {
    if (typeof v === 'number') {
      return this._containsInteger(v);
    } else {
      return this._containsRange(v);
    }
  }

  _containsInteger(i: number): boolean {
    return i >= this.start && i <= this.end;
  }

  _containsRange(other: IntegerRange): boolean {
    return this.start <= other.start && this.end >= other.end;
  }

  overlapsWith(other: IntegerRange): boolean {
    return this.contains(other.start) || this.contains(other.end);
  }

  startsBefore(other: IntegerRange): boolean {
    return this.start < other.start;
  }

  endsBefore(other: IntegerRange): boolean {
    return this.end < other.start;
  }

  startsAfter(other: IntegerRange): boolean {
    return this.start > other.end;
  }

  endsAfter(other: IntegerRange): boolean {
    return this.end > other.end;
  }

  fromStartToEnd(f: (i: number) => void): void {
    for (let i = this.start; i <= this.end; i++) {
      f(i);
    }
  }

  fromEndToStart(f: (i: number) => void): void {
    for (let i = this.end; i >= this.start; i--) {
      f(i);
    }
  }
}

export default IntegerRange;
