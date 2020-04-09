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
   * @returns {number} The number of bases in the layout.
   */
  get size() {
    return this._partners.length;
  }

  /**
   * @returns {boolean} 
   */
  isEmpty() {
    return this.size === 0;
  }
  
  /**
   * @param {number} p 
   * 
   * @returns {NormalizedBaseCoordinates} 
   */
  baseCoordinatesAtPosition(p) {
    return this._baseCoordinates[p - 1];
  }

  /**
   * @returns {number} 
   */
  get xMin() {
    if (this.isEmpty()) {
      return 0;
    } else {
      let xMin = this.baseCoordinatesAtPosition(1).xLeft;
      for (let p = 2; p <= this.size; p++) {
        let x = this.baseCoordinatesAtPosition(p).xLeft;
        if (x < xMin) {
          xMin = x;
        }
      }
      return xMin;
    }
  }

  /**
   * @returns {number} 
   */
  get xMax() {
    if (this.isEmpty()) {
      return 0;
    } else {
      let xMax = this.baseCoordinatesAtPosition(1).xRight;
      for (let p = 2; p <= this.size; p++) {
        let x = this.baseCoordinatesAtPosition(p).xRight;

        if (x > xMax) {
          xMax = x;
        }
      }
      return xMax;
    }
  }

  /**
   * @returns {number} 
   */
  get yMin() {
    if (this.isEmpty()) {
      return 0;
    } else {
      let yMin = this.baseCoordinatesAtPosition(1).yTop;
      for (let p = 2; p <= this.size; p++) {
        let y = this.baseCoordinatesAtPosition(p).yTop;
        if (y < yMin) {
          yMin = y;
        }
      }
      return yMin;
    }
  }

  /**
   * @returns {number} 
   */
  get yMax() {
    if (this.isEmpty()) {
      return 0;
    } else {
      let yMax = this.baseCoordinatesAtPosition(1).yBottom;
      for (let p = 2; p <= this.size; p++) {
        let y = this.baseCoordinatesAtPosition(p).yBottom;
        if (y > yMax) {
          yMax = y;
        }
      }
      return yMax;
    }
  }

  /**
   * @returns {number} 
   */
  get xCenter() {
    return (this.xMin + this.xMax) / 2;
  }

  /**
   * @returns {number} 
   */
  get yCenter() {
    return (this.yMin + this.yMax) / 2;
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
