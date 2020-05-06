class StrictLayoutPerBaseProps {

  /**
   * @param {StrictLayoutPerBaseProps~SavableState} savedState 
   * 
   * @returns {StrictLayoutPerBaseProps} 
   */
  static fromSavedState(savedState) {
    let pbps = new StrictLayoutPerBaseProps();
    if (savedState.stretch3 !== undefined) {
      pbps.stretch3 = savedState.stretch3;
    }
    if (savedState.flatOutermostLoopAngle3 !== undefined) {
      pbps.flatOutermostLoopAngle3 = savedState.flatOutermostLoopAngle3;
    }
    if (savedState.flipStem !== undefined) {
      pbps.flipStem = savedState.flipStem;
    }
    if (savedState.loopShape !== undefined) {
      pbps.loopShape = savedState.loopShape;
    }
    if (savedState.triangleLoopHeight !== undefined) {
      pbps.triangleLoopHeight = savedState.triangleLoopHeight;
    }
    return pbps;
  }

  constructor() {
    this.stretch3 = 0;
    this.flatOutermostLoopAngle3 = 0;
    this.flipStem = false;
    this.loopShape = 'round';
    this.triangleLoopHeight = 4;
  }

  /**
   * @returns {StrictLayoutPerBaseProps} 
   */
  deepCopy() {
    let savableState = this.savableState();
    return StrictLayoutPerBaseProps.fromSavedState(savableState);
  }

  /**
   * @typedef {Object} StrictLayoutPerBaseProps~SavableState 
   * @property {number} stretch3 
   * @property {number} flatOutermostLoopAngle3 
   * @property {boolean} flipStem 
   * @property {string} loopShape 
   * @property {number} triangleLoopHeight 
   */

  /**
   * @returns {StrictLayoutPerBaseProps~SavableState} 
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

export default StrictLayoutPerBaseProps;
