class MultiBond {

  /**
   * @param {Array<Base>} side1 The bases for one side of the bond.
   * @param {Array<Base>} side2 The bases for the other side of the bond.
   */
  constructor(side1, side2) {

    // make shallow copies
    this._side1 = side1.slice();
    this._side2 = side2.slice();

    this._validateSides();
  }

  /**
   * @throws {Error} If either side of this bond contains no bases.
   */
  _validateSides() {
    if (this._side1.length === 0) {
      throw new Error('Side 1 cannot be empty.');
    }

    if (this._side2.length === 0) {
      throw new Error('Side 2 cannot be empty.');
    }
  }

  /**
   * @param {Base} b 
   * 
   * @returns {boolean} True if the base is in this bond.
   */
  inBond(b) {
    let result = false;

    this._side1.forEach(b1 => result = result || Object.is(b1, b));
    this._side2.forEach(b2 => result = result || Object.is(b2, b));

    return result;
  }
}

export default MultiBond;
