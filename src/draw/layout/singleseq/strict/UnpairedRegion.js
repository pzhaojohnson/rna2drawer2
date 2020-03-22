import VirtualBaseCoordinates from '../../VirtualBaseCoordinates';
import baseCoordinatesFlatOutermostLoop from './UnpairedRegionFlatOutermostLoop';
import baseCoordinatesHairpin from './UnpairedRegionHairpin';
import baseCoordinatesStraight from './UnpairedRegionStraight';
import baseCoordinatesTriangularRound from './UnpairedRegionTriangularRound';

class UnpairedRegion {

  /**
   * @param {Stem} bs5 The stem immediately 5' to this unpaired region.
   * @param {Stem} bs3 The stem immediately 3' to this unpaired region.
   * @param {Array<number|null>} partners 
   * @param {StrictLayoutGeneralProps} generalProps 
   * @param {Array<StrictLayoutBaseProps>} baseProps 
   */
  constructor(bs5, bs3, partners, generalProps, baseProps) {
    this._partners = partners;
    this._generalProps = generalProps;
    this._baseProps = baseProps;

    this._boundingStem5 = bs5;
    this._boundingStem3 = bs3;
  }

  /**
   * @returns {Stem} The stem immediately 5' to this unpaired region.
   */
  get boundingStem5() {
    return this._boundingStem5;
  }

  /**
   * @returns {Stem} The stem immediately 3' to this unpaired region.
   */
  get boundingStem3() {
    return this._boundingStem3;
  }

  /**
   * @returns {number} The 5' position just outside of this unpaired region.
   */
  get boundingPosition5() {
    if (this.isHairpinLoop()) {
      return this.boundingStem5.positionTop5;
    } else if (this.boundingStem5.isOuterTo(this.boundingStem3)) {
      return this.boundingStem5.positionTop5;
    } else {
      return this.boundingStem5.position3;
    }
  }

  /**
   * @returns {number} The 3' position just outside of this unpaired region.
   */
  get boundingPosition3() {
    if (this.isHairpinLoop()) {
      return this.boundingStem5.positionTop3;
    } else if (this.boundingStem3.isOuterTo(this.boundingStem5)) {
      return this.boundingStem3.positionTop3;
    } else {
      return this.boundingStem3.position5;
    }
  }

  /**
   * @returns {number} 
   */
  get boundingStemOutwardAngle5() {
    if (this.isHairpinLoop()) {
      return this.boundingStem5.reverseAngle;
    } else if (this.boundingStem5.isOuterTo(this.boundingStem3)) {
      return this.boundingStem5.reverseAngle;
    } else {
      return this.boundingStem5.angle;
    }
  }

  /**
   * @returns {number} 
   */
  get boundingStemOutwardAngle3() {
    if (this.isHairpinLoop()) {
      return this.boundingStem3.reverseAngle;
    } else if (this.boundingStem3.isOuterTo(this.boundingStem5)) {
      return this.boundingStem3.reverseAngle;
    } else {
      return this.boundingStem3.angle;
    }
  }

  /**
   * @returns {VirtualBaseCoordinates} The coordinates of the 5' bounding position.
   */
  baseCoordinatesBounding5() {
    if (this.isHairpinLoop()) {
      return this.boundingStem5.baseCoordinatesTop5();
    } else if (this.boundingStem5.isOuterTo(this.boundingStem3)) {
      return this.boundingStem5.baseCoordinatesTop5();
    } else {
      return this.boundingStem5.baseCoordinates3();
    }
  }

  /**
   * @returns {VirtualBaseCoordinates} The coordinates of the 3' bounding position.
   */
  baseCoordinatesBounding3() {
    if (this.isHairpinLoop()) {
      return this.boundingStem5.baseCoordinatesTop3();
    } else if (this.boundingStem3.isOuterTo(this.boundingStem5)) {
      return this.boundingStem3.baseCoordinatesTop3();
    } else {
      return this.boundingStem3.baseCoordinates5();
    }
  }

  /**
   * @returns {number} The number of bases in this unpaired region.
   */
  get size() {
    return this.boundingPosition3 - this.boundingPosition5 - 1;
  }

  /**
   * @returns {boolean} 
   */
  isHairpinLoop() {

    // the two bounding stems are the same
    return this.boundingStem5.position5 === this.boundingStem3.position5;
  }

  /**
   * @returns {boolean} 
   */
  isDangling5() {
    return this.boundingStem5.isOutermostStem() && !this.isHairpinLoop();
  }

  /**
   * @returns {boolean} 
   */
  isDangling3() {
    return this.boundingStem3.isOutermostStem() && !this.isHairpinLoop();
  }

  /**
   * @returns {number} The minimum length of this unpaired region.
   */
  get minLength() {
    if (this.isHairpinLoop()) {
      return this.size;
    } else if (this.size === 0) {
      return 0;
    } else if (this.size === 1) {
      return 1;
    } else {
      return 2;
    }
  }

  /**
   * @returns {number} 
   */
  get length() {
    let length = 0;
    if (this.boundingPosition5 > 0) {
      length += this._baseProps[this.boundingPosition5 - 1].stretch3;
    }
    for (let p = this.boundingPosition5 + 1; p < this.boundingPosition3; p++) {
      length += 1 + this._baseProps[p - 1].stretch3;
    }
    return Math.max(length, this.minLength);
  }

  /**
   * @param {boolean} inOutermostLoop 
   * 
   * @returns {Array<VirtualBaseCoordinates>} 
   */
  baseCoordinates(inOutermostLoop) {
    if (inOutermostLoop && this._generalProps.flatOutermostLoop) {
      return baseCoordinatesFlatOutermostLoop(this, this._generalProps, this._baseProps);
    } else if (this.isHairpinLoop()) {
      return baseCoordinatesHairpin(this);
    } else {
      let bcb5 = this.baseCoordinatesBounding5();
      let bcb3 = this.baseCoordinatesBounding3();
      if (bcb5.distanceBetweenCenters(bcb3) - 1 >= this.size) {
        return baseCoordinatesStraight(this, this._baseProps);
      } else {
        return baseCoordinatesTriangularRound(this, this._generalProps);
      }
    }
  }
}

export default UnpairedRegion;
