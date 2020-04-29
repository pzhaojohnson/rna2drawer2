class StrictLayoutBaseProps {

  /**
   * @param {StrictLayoutBaseProps~SavableState} savedState 
   * 
   * @returns {StrictLayoutBaseProps} 
   */
  static fromSavedState(savedState) {
    let bps = new StrictLayoutBaseProps();
    if (savedState.stretch3 !== undefined) {
      bps.stretch3 = savedState.stretch3;
    }
    if (savedState.flatOutermostLoopAngle3 !== undefined) {
      bps.flatOutermostLoopAngle3 = savedState.flatOutermostLoopAngle3;
    }
    if (savedState.flipStem !== undefined) {
      bps.flipStem = savedState.flipStem;
    }
    if (savedState.loopShape !== undefined) {
      bps.loopShape = savedState.loopShape;
    }
    if (savedState.triangleLoopHeight !== undefined) {
      bps.triangleLoopHeight = savedState.triangleLoopHeight;
    }
    return bps;
  }

  constructor() {
    this.stretch3 = 0;
    this.flatOutermostLoopAngle3 = 0;
    this.flipStem = false;
    this.loopShape = 'round';
    this.triangleLoopHeight = 4;
  }

  /**
   * @returns {StrictLayoutBaseProps} 
   */
  deepCopy() {
    let savableState = this.savableState();
    return StrictLayoutBaseProps.fromSavedState(savableState);
  }

  /**
   * @typedef {Object} StrictLayoutBaseProps~SavableState 
   * @property {number} stretch3 
   * @property {number} flatOutermostLoopAngle3 
   * @property {boolean} flipStem 
   * @property {string} loopShape 
   * @property {number} triangleLoopHeight 
   */

  /**
   * @returns {StrictLayoutBaseProps~SavableState} 
   */
  savableState() {
    return {
      stretch3: this.stretch3,
      flatOutermostLoopAngle3: this.flatOutermostLoopAngle3,
      flipStem: this.flipStem,
      loopShape: this.loopShape,
      triangleLoopHeight: this.triangleLoopHeight,
    };
  }
}

export default StrictLayoutBaseProps;
