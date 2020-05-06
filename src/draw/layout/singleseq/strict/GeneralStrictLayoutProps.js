class GeneralStrictLayoutProps {
  
  /**
   * @param {GeneralStrictLayoutProps~SavableState} savedState 
   * 
   * @returns {GeneralStrictLayoutProps} 
   */
  static fromSavedState(savedState) {
    let gps = new GeneralStrictLayoutProps();
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
   * @returns {GeneralStrictLayoutProps} 
   */
  deepCopy() {
    let savableState = this.savableState();
    return GeneralStrictLayoutProps.fromSavedState(savableState);
  }

  /**
   * @typedef {Object} GeneralStrictLayoutProps~SavableState 
   * @property {string} className 
   * @property {boolean} flatOutermostLoop 
   * @property {number} rotation 
   * @property {number} basePairBondLength 
   * @property {number} basePairPadding 
   * @property {number} terminiGap 
   */

  /**
   * @returns {GeneralStrictLayoutProps~SavableState} 
   */
  savableState() {
    return {
      className: 'GeneralStrictLayoutProps',
      flatOutermostLoop: this.flatOutermostLoop,
      rotation: this.rotation,
      basePairBondLength: this.basePairBondLength,
      basePairPadding: this.basePairPadding,
      terminiGap: this.terminiGap,
    };
  }
}

export default GeneralStrictLayoutProps;
