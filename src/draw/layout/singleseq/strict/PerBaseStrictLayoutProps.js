class PerBaseStrictLayoutProps {

  /**
   * @param {Array<PerBaseStrictLayoutProps>} arr 
   * 
   * @returns {Array<PerBaseStrictLayoutProps>} 
   */
  static deepCopyArray(arr) {
    let copyArr = [];
    arr.forEach(props => {
      copyArr.push(props.deepCopy());
    });
    return copyArr;
  }

  /**
   * @param {PerBaseStrictLayoutProps~SavableState} savedState 
   * 
   * @returns {PerBaseStrictLayoutProps} 
   */
  static fromSavedState(savedState) {
    let pbps = new PerBaseStrictLayoutProps();
    if (savedState.stretch3 !== undefined) {
      pbps.stretch3 = savedState.stretch3;
    }
    if (savedState.flatLoopAngle3 !== undefined) {
      pbps.flatLoopAngle3 = savedState.flatLoopAngle3;
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
    this.flatLoopAngle3 = 0;
    this.flipStem = false;
    this.loopShape = 'round';
    this.triangleLoopHeight = 4;
  }

  /**
   * @returns {PerBaseStrictLayoutProps} 
   */
  deepCopy() {
    let savableState = this.savableState();
    return PerBaseStrictLayoutProps.fromSavedState(savableState);
  }

  /**
   * @typedef {Object} PerBaseStrictLayoutProps~SavableState 
   * @property {string} className 
   * @property {number} stretch3 
   * @property {number} flatLoopAngle3 
   * @property {boolean} flipStem 
   * @property {string} loopShape 
   * @property {number} triangleLoopHeight 
   */

  /**
   * @returns {PerBaseStrictLayoutProps~SavableState} 
   */
  savableState() {
    return {
      className: 'PerBaseStrictLayoutProps',
      stretch3: this.stretch3,
      flatLoopAngle3: this.flatLoopAngle3,
      flipStem: this.flipStem,
      loopShape: this.loopShape,
      triangleLoopHeight: this.triangleLoopHeight,
    };
  }
}

export default PerBaseStrictLayoutProps;
