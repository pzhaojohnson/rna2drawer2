class GeneralStrictLayoutProps {
  
  /**
   * @param {GeneralStrictLayoutProps~SavableState} savedState 
   * 
   * @returns {GeneralStrictLayoutProps} 
   */
  static fromSavedState(savedState) {
    let gps = new GeneralStrictLayoutProps();
    if (savedState.outermostLoopShape !== undefined) {
      gps.outermostLoopShape = savedState.outermostLoopShape;
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
    this.outermostLoopShape = 'round';
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
   * @property {string} outermostLoopShape 
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
      outermostLoopShape: this.outermostLoopShape,
      rotation: this.rotation,
      basePairBondLength: this.basePairBondLength,
      basePairPadding: this.basePairPadding,
      terminiGap: this.terminiGap,
    };
  }
}

export default GeneralStrictLayoutProps;
