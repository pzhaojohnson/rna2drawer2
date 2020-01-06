class SingleBond {

  /**
   * @param {Base} b1 One base in this bond.
   * @param {Base} b2 The other base in this bond.
   */
  constructor(b1, b2) {
    this._base1 = b1;
    this._base2 = b2;
    this._validateBases();
  }

  /**
   * @throws {Error} If a single base was input to be both bases of this bond.
   */
  _validateBases() {
    if (Object.is(this._base1, this._base2)) {
      throw new Error('A base cannot have a bond with itself.');
    }
  }

  /**
   * @returns {Base} The base in this bond referred to as base1.
   */
  get base1() {
    return this._base1;
  }

  /**
   * @returns {Base} The base in this bond referred to as base2.
   */
  get base2() {
    return this._base2;
  }

  /**
   * @param {Base} b 
   * 
   * @returns {boolean} True if the given base is in this bond.
   */
  inBond(b) {
    return Object.is(this.base1, b) || Object.is(this.base2, b);
  }

  /**
   * @param {Base} b One of the bases in this bond.
   * 
   * @returns {Base} The other base in this bond.
   * 
   * @throws {Error} If the given base is not in this bond.
   */
  otherBase(b) {
    if (!this.inBond(b)) {
      throw new Error("The given base is not in this bond.");
    } else if (Object.is(this.base1, b)) {
      return this.base2;
    } else {
      return this.base1;
    }
  }
}

export default SingleBond;
