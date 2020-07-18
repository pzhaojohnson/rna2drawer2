export class ColorSet {
  _colors: Set<string>;

  /**
   * 
   * @param cs A list of 7 character hex codes (beginning with #).
   */
  constructor(cs: string[]) {
    this._colors = new Set<string>();
    cs.forEach(c => this._colors.add(c.toLowerCase()));
  }

  get size(): number {
    return this._colors.size;
  }

  /**
   * @param c A 7 character hex code (beginning with #).
   */
  has(c: string): boolean {
    return this._colors.has(c.toLowerCase());
  }

  toArray(): string[] {
    let arr = [] as string[];
    this._colors.forEach(c => arr.push(c));
    return arr;
  }
}

export default ColorSet;
