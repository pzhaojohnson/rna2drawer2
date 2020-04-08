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
    if (savedState.basePixelWidth !== undefined) {
      gps.basePixelWidth = savedState.basePixelWidth;
    }
    if (savedState.basePixelHeight !== undefined) {
      gps.basePixelHeight = savedState.basePixelHeight;
    }
    return gps;
  }

  constructor() {
    this.flatOutermostLoop = false;
    this.rotation = 0.0;

    this.basePairBondLength = 1.2;
    this.basePairPadding = 0;
    
    this.terminiGap = 4;

    this.basePixelWidth = 12;
    this.basePixelHeight = 12;
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
   * @property {number} basePixelWidth 
   * @property {number} basePixelHeight 
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
      basePixelWidth: this.basePixelWidth,
      basePixelHeight: this.basePixelHeight,
    };
  }
}

export default StrictLayoutGeneralProps;
