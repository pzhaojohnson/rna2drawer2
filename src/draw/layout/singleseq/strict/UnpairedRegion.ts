import {
  UnpairedRegionInterface,
  StemInterface as Stem,
} from './StemInterface';
import { Partners } from 'Partners/Partners';
import NormalizedBaseCoordinates from '../../NormalizedBaseCoordinates';
import baseCoordinatesFlatOutermostLoop from './UnpairedRegionFlatOutermostLoop';
import { baseCoordinatesRound } from './UnpairedRegionRound';
import GeneralStrictLayoutProps from './GeneralStrictLayoutProps';
import PerBaseStrictLayoutProps from './PerBaseStrictLayoutProps';

class UnpairedRegion implements UnpairedRegionInterface {
  _partners: Partners;
  _generalProps: GeneralStrictLayoutProps;
  _perBaseProps: PerBaseStrictLayoutProps[];

  _boundingStem5: Stem;
  _boundingStem3: Stem;

  /**
   * bs5 is the stem immediately 5' to this unpaired region.
   * bs3 is the stem immediately 3' to this unpaired region.
   */
  constructor(
    bs5: Stem,
    bs3: Stem,
    partners: Partners,
    generalProps: GeneralStrictLayoutProps,
    perBaseProps: PerBaseStrictLayoutProps[],
  ) {
    this._partners = partners;
    this._generalProps = generalProps;
    this._perBaseProps = perBaseProps;

    this._boundingStem5 = bs5;
    this._boundingStem3 = bs3;
  }

  /**
   * The stem immediately 5' to this unpaired region.
   */
  get boundingStem5(): Stem {
    return this._boundingStem5;
  }

  /**
   * The stem immediately 3' to this unpaired region.
   */
  get boundingStem3(): Stem {
    return this._boundingStem3;
  }

  /**
   * The 5' position just outside of this unpaired region.
   */
  get boundingPosition5(): number {
    if (this.isHairpinLoop()) {
      return this.boundingStem5.positionTop5;
    } else if (this.boundingStem5.isOuterTo(this.boundingStem3)) {
      return this.boundingStem5.positionTop5;
    } else {
      return this.boundingStem5.position3;
    }
  }

  /**
   * The 3' position just outside of this unpaired region.
   */
  get boundingPosition3(): number {
    if (this.isHairpinLoop()) {
      return this.boundingStem5.positionTop3;
    } else if (this.boundingStem3.isOuterTo(this.boundingStem5)) {
      return this.boundingStem3.positionTop3;
    } else {
      return this.boundingStem3.position5;
    }
  }

  get boundingStemOutwardAngle5(): number {
    if (this.isHairpinLoop()) {
      return this.boundingStem5.reverseAngle;
    } else if (this.boundingStem5.isOuterTo(this.boundingStem3)) {
      return this.boundingStem5.reverseAngle;
    } else {
      return this.boundingStem5.angle;
    }
  }

  get boundingStemOutwardAngle3(): number {
    if (this.isHairpinLoop()) {
      return this.boundingStem3.reverseAngle;
    } else if (this.boundingStem3.isOuterTo(this.boundingStem5)) {
      return this.boundingStem3.reverseAngle;
    } else {
      return this.boundingStem3.angle;
    }
  }

  baseCoordinatesBounding5(): NormalizedBaseCoordinates {
    if (this.isHairpinLoop()) {
      return this.boundingStem5.baseCoordinatesTop5();
    } else if (this.boundingStem5.isOuterTo(this.boundingStem3)) {
      return this.boundingStem5.baseCoordinatesTop5();
    } else {
      return this.boundingStem5.baseCoordinates3();
    }
  }

  baseCoordinatesBounding3(): NormalizedBaseCoordinates {
    if (this.isHairpinLoop()) {
      return this.boundingStem5.baseCoordinatesTop3();
    } else if (this.boundingStem3.isOuterTo(this.boundingStem5)) {
      return this.boundingStem3.baseCoordinatesTop3();
    } else {
      return this.boundingStem3.baseCoordinates5();
    }
  }

  /**
   * The number of bases in this unpaired region.
   */
  get size(): number {
    return this.boundingPosition3 - this.boundingPosition5 - 1;
  }

  isHairpinLoop(): boolean {
    return this.boundingStem5.position5 === this.boundingStem3.position5;
  }

  isDangling5(): boolean {
    return this.boundingStem5.isOutermostStem() && !this.isHairpinLoop();
  }

  isDangling3(): boolean {
    return this.boundingStem3.isOutermostStem() && !this.isHairpinLoop();
  }

  get length(): number {
    let length = 0;
    if (this.boundingPosition5 > 0) {
      let pbps = PerBaseStrictLayoutProps.getOrCreatePropsAtPosition(this._perBaseProps, this.boundingPosition5);
      length += pbps.stretch3;
    }
    for (let p = this.boundingPosition5 + 1; p < this.boundingPosition3; p++) {
      let pbps = PerBaseStrictLayoutProps.getOrCreatePropsAtPosition(this._perBaseProps, p);
      length += 1 + pbps.stretch3;
    }
    return Math.max(length, 0);
  }

  baseCoordinates(inOutermostLoop: boolean): NormalizedBaseCoordinates[] {
    if (inOutermostLoop && this._generalProps.outermostLoopShape === 'flat') {
      return baseCoordinatesFlatOutermostLoop(this, this._generalProps, this._perBaseProps);
    } else {
      return baseCoordinatesRound(this, this._generalProps);
    }
  }
}

export default UnpairedRegion;
