class StrictLayoutGeneralProps {
  
  /**
   * @param {StrictLayoutGeneralProps~SavableState} savedState 
   * 
   * @returns {StrictLayoutGeneralProps} 
   */
  static fromSavedState(savedState) {
    let gps = new StrictLayoutGeneralProps();
    if (savedState.flatOutermostLoop !== undefined) {
      gps.flatOutermostLoop = savedState.flatOutermostLoop;
    }
    if (savedState.rotation !== undefined) {
      gps.rotation = savedState.rotation;
    }
    if (savedState.basePairBondLength !== undefined) {
      gps.basePairBondLength = savedState.basePairBondLength;
    }
    if (savedState.basePairPadding !== undefined) {
      gps.basePairPadding = savedState.basePairPadding;
    }
    if (savedState.terminiGap !== undefined) {
      gps.terminiGap = savedState.terminiGap;
    }
    return gps;
  }

  constructor() {
    this.flatOutermostLoop = false;
    this.rotation = 0.0;

    this.basePairBondLength = 1.2;
    this.basePairPadding = 0;
    
    this.terminiGap = 4;
  }

  /**
   * @returns {StrictLayoutGeneralProps} 
   */
  deepCopy() {
    let savableState = this.savableState();
    return StrictLayoutGeneralProps.fromSavedState(savableState);
  }

  /**
   * @typedef {Object} StrictLayoutGeneralProps~SavableState 
   * @property {boolean} flatOutermostLoop 
   * @property {number} rotation 
   * @property {number} basePairBondLength 
   * @property {number} basePairPadding 
   * @property {number} terminiGap 
   */

  /**
   * @returns {StrictLayoutGeneralProps~SavableState} 
   */
  savableState() {
    return {
      flatOutermostLoop: this.flatOutermostLoop,
      rotation: this.rotation,
      basePairBondLength: this.basePairBondLength,
      basePairPadding: this.basePairPadding,
      terminiGap: this.terminiGap,
    };
  }
}

export default StrictLayoutGeneralProps;
