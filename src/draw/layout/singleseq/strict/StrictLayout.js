import Stem from './Stem';
import { StemLayout } from './StemLayout';
import splitSecondaryAndTertiaryPairs from '../../../../parse/splitSecondaryAndTertiaryPairs'
import GeneralStrictLayoutProps from './GeneralStrictLayoutProps';
import PerBaseStrictLayoutProps from './PerBaseStrictLayoutProps';

export class StrictLayout {

  /**
   * @param {Array<number|null>} partners The partners notation of the secondary structure.
   * @param {GeneralStrictLayoutProps} generalProps 
   * @param {Array<PerBaseStrictLayoutProps>} perBaseProps 
   */
  constructor(partners, generalProps, perBaseProps) {
    this._partners = partners;
    this._validatePartners();
    
    this._generalProps = generalProps;
    this._validateGeneralProps();

    this._perBaseProps = perBaseProps;
    this._validatePerBaseProps();

    this._outermostStem = new Stem(
      0,
      this._partners,
      this._generalProps,
      this._perBaseProps
    );
    StemLayout.setCoordinatesAndAngles(
      this._outermostStem,
      this._generalProps,
      this._perBaseProps
    );
    this._baseCoordinates = this._outermostStem.baseCoordinates();
  }
  
  _validatePartners() {
    for (let i = 0; i < this._partners.length; i++) {
      if (!this._partners[i]) {
        this._partners[i] = null;
      }
    }
    this._partners = splitSecondaryAndTertiaryPairs(this._partners).secondaryPartners;
  }

  _validateGeneralProps() {
    if (!this._generalProps) {
      this._generalProps = new GeneralStrictLayoutProps();
    }
  }

  _validatePerBaseProps() {
    if (!this._perBaseProps) {
      this._perBaseProps = [];
    }
    while (this._perBaseProps.length < this._partners.length) {
      this._perBaseProps.push(new PerBaseStrictLayoutProps());
    }
    for (let i = 0; i < this._perBaseProps.length; i++) {
      if (!this._perBaseProps[i]) {
        this._perBaseProps[i] = new PerBaseStrictLayoutProps();
      }
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
