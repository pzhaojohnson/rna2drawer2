import Stem from './Stem';
import { StemLayout } from './StemLayout';
import isKnotless from '../../../../parse/isKnotless';

class StrictLayout {

  /**
   * @param {Array<number|null>} partners The partners notation of the secondary structure.
   * @param {StrictLayoutGeneralProps} generalProps 
   * @param {Array<StrictLayoutBaseProps>} baseProps 
   */
  constructor(partners, generalProps, baseProps) {
    this._partners = partners;
    this._validatePartners();
    
    this._generalProps = generalProps;
    this._baseProps = baseProps;
    
    this._outermostStem = new Stem(0, partners, generalProps, baseProps);
    StemLayout.setCoordinatesAndAngles(this._outermostStem, generalProps, baseProps);
    this._baseCoordinates = this._outermostStem.baseCoordinates();
  }
  
  /**
   * @throws {Error} If the partners notation contains knots.
   */
  _validatePartners() {
    if (!isKnotless(this._partners)) {
      throw new Error('The partners notation cannot contain knots.');
    }
  }
  
  /**
   * @param {number} position 
   * 
   * @returns {VirtualBaseCoordinates} 
   */
  baseCoordinates(position) {
    return this._baseCoordinates[position - 1];
  }

  /**
   * @returns {number} 
   */
  get xMin() {
    let xMin = this.baseCoordinates(1).xLeft;
    for (let p = 2; p <= this.seq.length; p++) {
      let x = this.baseCoordinates(p).xLeft;
      if (x < xMin) {
        xMin = x;
      }
    }
    return xMin;
  }

  /**
   * @returns {number} 
   */
  get xMax() {
    let xMax = this.baseCoordinates(1).xRight;
    for (let p = 2; p <= this.seq.length; p++) {
      let x = this.baseCoordinates(p).xRight;

      if (x > xMax) {
        xMax = x;
      }
    }
    return xMax;
  }

  /**
   * @returns {number} 
   */
  get xCenter() {
    return (this.xMin() + this.xMax()) / 2.0;
  }

  /**
   * @returns {number} 
   */
  get yMin() {
    let yMin = this.baseCoordinates(1).yTop;
    for (let p = 2; p <= this.seq.length; p++) {
      let y = this.baseCoordinates(p).yTop;
      if (y < yMin) {
        yMin = y;
      }
    }
    return yMin;
  }

  /**
   * @returns {number} 
   */
  get yMax() {
    let yMax = this.baseCoordinates(1).yBottom;
    for (let p = 2; p <= this.seq.length; p++) {
      let y = this.baseCoordinates(p).yBottom;
      if (y > yMax) {
        yMax = y;
      }
    }
    return yMax;
  }

  /**
   * @returns {number} 
   */
  get yCenter() {
    return (this.yMin + this.yMax) / 2.0;
  }

  /**
   * @returns {number} 
   */
  get width() {
    return this.xMax - this.xMin;
  }

  /**
   * @returns {number} 
   */
  get height() {
    return this.yMax - this.yMin;
  }
}

export default StrictLayout;
