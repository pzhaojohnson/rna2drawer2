import { polarizeLength } from './circle';
import VirtualBaseCoordinates from '../../VirtualBaseCoordinates';
import baseCoordinatesFlatOutermostLoop from './UnpairedRegionFlatOutermostLoop';
import baseCoordinatesHairpin from './UnpairedRegionHairpin';
import baseCoordinatesStraight from './UnpairedRegionStraight';
import baseCoordinatesTriangularRound from './UnpairedRegionTriangularRound';

/**
 * The unpaired bases between two neighboring stems.
 */
class UnpairedRegion {

  /**
   * @param {Stem} bs5 The stem immediately 5' to this unpaired region.
   * @param {Stem} bs3 The stem immediately 3' to this unpaired region.
   * @param {Array<number|null>} partners The partners notation of the secondary structure.
   * @param {StrictLayoutGeneralProps} generalProps The drawing properties of the layout.
   * @param {Array<StrictLayoutBaseProps>} baseProps The base properties of the layout.
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
   * @returns {VirtualBaseCoordinates} The base coordinates of the 5' bounding position of this unpaired region.
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
   * @returns {VirtualBaseCoordinates} The base coordinates of the 3' bounding position of this unpaired region.
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
   * @returns {boolean} True if this unpaired region is a hairpin loop.
   */
  isHairpinLoop() {
    return Object.is(this.boundingStem5, this.boundingStem3);
  }

  isDangling5() {
    return this.boundingStem5.isOutermostStem() && !this.isHairpinLoop();
  }

  isDangling3() {
    return this.boundingStem3.isOutermostStem() && !this.isHairpinLoop();
  }

  /**
   * @returns {number} The minimum length of this unpaired region.
   */
  get minLength() {
    if (this.isHairpinLoop()) {
      return this.size;
    } else if (this.size === 0 || this.size === 1) {
      return this.size;
    } else {
      return 2;
    }
  }

  /**
   * Accessing this property may take greater than constant time.
   * 
   * @returns {number} The length of this unpaired region.
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
   * Accessing this property may take greater than constant time.
   * 
   * @returns {number} The polar length of this unpaired region.
   */
  get polarLength() {
    return polarizeLength(this.length);
  }

  /**
   * @param {boolean} inOutermostLoop True if base coordinates are to be generated as though this unpaird region
   *  were in the outermost loop.
   * 
   * @returns {Array<VirtualBaseCoordinates>} The base coordinates of all positions in this unpaired region.
   */
  baseCoordinates(inOutermostLoop) {
    if (inOutermostLoop && this._generalProps.flatOutermostLoop) {
      return baseCoordinatesFlatOutermostLoop(this, this._baseProps);
    } else if (this.isHairpinLoop()) {
      return baseCoordinatesHairpin(this);
    } else {
      let cbp5 = this.baseCoordinatesBounding5();
      let cbp3 = this.baseCoordinatesBounding3();

      if (cbp5.distanceBetweenCenters(cbp3) - 1 >= this.size) {
        return baseCoordinatesStraight(this, this._baseProps);
      } else {
        return baseCoordinatesTriangularRound(this);
      }
    }
  }
}

export default UnpairedRegion;
