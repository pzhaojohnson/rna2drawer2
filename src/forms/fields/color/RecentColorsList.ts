export class RecentColorsList {
  _maxLength: number;
  _hexs: string[];

  constructor(maxLength: number) {
    this._maxLength = maxLength;
    this._hexs = [];
  }

  get maxLength(): number {
    return this._maxLength;
  }

  get length(): number {
    return this._hexs.length;
  }

  colorAt(i: number): (string | undefined) {
    return this._hexs[i];
  }

  /**
   * @param hex A 7 character hex code (beginning with #).
   */
  push(hex: string) {
    hex = hex.toLowerCase();
    this._hexs = this._hexs.filter(h => h != hex);
    this._hexs.push(hex);
    this._hexs = this._hexs.slice(-this.maxLength);
  }

  slice(start?: number, end?: number): string[] {
    return this._hexs.slice(start, end);
  }
}

export default RecentColorsList;
