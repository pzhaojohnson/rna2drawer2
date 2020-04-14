import UnpairedRegion from './UnpairedRegion';
import NormalizedBaseCoordinates from '../../NormalizedBaseCoordinates';
import normalizeAngle from '../../../normalizeAngle';

/**
 * The outermost stem of a layout is an imaginary base pair between positions
 * zero and the sequence length plus one and is meant as a convenient way to
 * store the entire recursive structure in one object. The coordinates and angle
 * of the outermost stem should have no influence on the rest of the layout.
 */
class Stem {

  /**
   * @param {StrictLayoutGeneralProps} generalProps 
   * 
   * @returns {number} 
   */
  static width(generalProps) {
    return 2 + generalProps.basePairBondLength;
  }

  /**
   * @param {number} p5 The 5' most position of this stem.
   * @param {Array<number|null>} partners 
   * @param {StrictLayoutGeneralProps} generalProps 
   * @param {Array<StrictLayoutBaseProps>} baseProps 
   */
  constructor(p5, partners, generalProps, baseProps) {
    this._partners = partners;
    this._generalProps = generalProps;
    this._baseProps = baseProps;
    
    this._position5 = p5;
    this._initializePosition3();
    this._initializeSize();

    this._initializeLoop();

    this._xBottomCenter = 0;
    this._yBottomCenter = 0;
    this._angle = 0;
  }

  _initializePosition3() {
    if (this.isOutermostStem()) {
      this._position3 = this._partners.length + 1;
    } else {
      this._position3 = this._partners[this._position5 - 1];
    }
  }

  _initializeSize() {
    if (this.isOutermostStem()) {
      this._size = 1;
    } else {
      let partners = this._partners;
      let p = this.position5 + 1;
      let q = this.position3 - 1;
      while (p < q && partners[p - 1] === q) {
        p++;
        q--;
      }
      this._size = p - this.position5;
    }
  }

  /**
   * @throws {Error} If a knot is encountered.
   */
  _initializeLoop() {
    this._loop = [];
    let partners = this._partners;
    let gps = this._generalProps;
    let bps = this._baseProps;
    let bst5 = this;
    let p = this.position5 + this.size;
    while (partners[p - 1] === null) {
      p++;
    }
    while (p < this.positionTop3) {
      if (partners[p - 1] < p) {
        throw new Error('Knot encountered in loop.');
      }
      let bst3 = new Stem(p, partners, gps, bps);
      this._loop.push(new UnpairedRegion(bst5, bst3, partners, gps, bps));
      this._loop.push(bst3);
      bst5 = bst3;
      p = bst5.position3 + 1;
      while (partners[p - 1] === null) {
        p++;
      }
    }
    this._loop.push(new UnpairedRegion(bst5, this, partners, gps, bps));
  }

  /**
   * The 5' most position of the outermost stem is zero.
   * 
   * @returns {number} The 5' most position of this stem.
   */
  get position5() {
    return this._position5;
  }

  /**
   * The 3' most position of the outermost stem is the sequence length plus one.
   * 
   * @returns {number} The 3' most position of this stem.
   */
  get position3() {
    return this._position3;
  }

  /**
   * @returns {number} The 5' position of the top base pair of this stem.
   */
  get positionTop5() {
    return this.position5 + this.size - 1;
  }

  /**
   * @returns {number} The 3' position of the top base pair of this stem.
   */
  get positionTop3() {
    return this.position3 - this.size + 1;
  }

  /**
   * The size of the outermost stem is one.
   * 
   * @returns {number} The number of base pairs in this stem.
   */
  get size() {
    return this._size;
  }

  /**
   * @returns {Object} 
   */
  loopIterator() {
    return this._loop[Symbol.iterator]();
  }

  /**
   * @returns {number} The number of stems in the loop of this stem.
   */
  get numBranches() {
    let it = this.loopIterator();
    let num = 0;
    it.next();
    let next = it.next();
    while (!next.done) {
      num++;
      it.next();
      next = it.next();
    }
    return num;
  }

  /**
   * @returns {UnpairedRegion} 
   */
  get firstUnpairedRegionInLoop() {
    let it = this.loopIterator();
    return it.next().value;
  }

  /**
   * @returns {UnpairedRegion} 
   */
  get lastUnpairedRgionInLoop() {
    let it = this.loopIterator();
    let next = it.next();
    let value;
    while (!next.done) {
      value = next.value;
      next = it.next();
    }
    return value;
  }

  /**
   * Returns null if the loop contains no stems.
   * 
   * @returns {Stem|null} 
   */
  get firstStemInLoop() {
    if (this.numBranches === 0) {
      return null;
    }
    let it = this.loopIterator();
    it.next();
    return it.next().value;
  }

  /**
   * Returns null if the loop contains no stems.
   * 
   * @returns {Stem|null} 
   */
  get lastStemInLoop() {
    if (this.numBranches === 0) {
      return null;
    }
    let it = this.loopIterator();
    it.next();
    let st;
    let next = it.next();
    while (!next.done) {
      st = next.value;
      it.next();
      next = it.next();
    }
    return st;
  }

  /**
   * @returns {number} 
   */
  get xBottomCenter() {
    return this._xBottomCenter;
  }

  set xBottomCenter(x) {
    this._xBottomCenter = x;
  }

  /**
   * @returns {number} 
   */
  get yBottomCenter() {
    return this._yBottomCenter;
  }

  set yBottomCenter(y) {
    this._yBottomCenter = y;
  }

  /**
   * @returns {number} The angle from bottom to top of this stem.
   */
  get angle() {
    return this._angle;
  }

  set angle(a) {
    this._angle = a;
  }

  /**
   * @returns {number} 
   */
  get reverseAngle() {
    return this.angle + Math.PI;
  }

  /**
   * @returns {number} 
   */
  get width() {
    return Stem.width(this._generalProps);
  }

  /**
   * @returns {number} 
   */
  get height() {
    let basePairPadding = this._generalProps.basePairPadding;
    return this.size + ((this.size - 1) * basePairPadding);
  }

  /**
   * @returns {number} 
   */
  get loopLength() {
    let ll = 0;
    let it = this.loopIterator();
    let next = it.next();
    ll += next.value.length;
    next = it.next();
    while (!next.done) {
      ll += next.value.width;
      next = it.next();
      ll += next.value.length;
      next = it.next();
    }
    return ll;
  }

  /**
   * @returns {number} 
   */
  get xTopCenter() {
    return this.xBottomCenter + (Math.cos(this.angle) * this.height);
  }

  /**
   * @returns {number} 
   */
  get yTopCenter() {
    return this.yBottomCenter + (Math.sin(this.angle) * this.height);
  }

  /**
   * @returns {number} 
   */
  get xBottomLeft() {
    return this.xBottomCenter + ((this.width / 2) * Math.cos(this.angle - (Math.PI / 2)));
  }

  /**
   * @returns {number} 
   */
  get yBottomLeft() {
    return this.yBottomCenter + ((this.width / 2) * Math.sin(this.angle - (Math.PI / 2)));
  }

  /**
   * @returns {number} 
   */
  get xBottomRight() {
    return this.xBottomCenter + ((this.width / 2) * Math.cos(this.angle + (Math.PI / 2)));
  }

  /**
   * @returns {number} 
   */
  get yBottomRight() {
    return this.yBottomCenter + ((this.width / 2) * Math.sin(this.angle + (Math.PI / 2)));
  }

  /**
   * @returns {number} 
   */
  get xTopLeft() {
    return this.xTopCenter + ((this.width / 2) * Math.cos(this.angle - (Math.PI / 2)));
  }

  /**
   * @returns {number} 
   */
  get yTopLeft() {
    return this.yTopCenter + ((this.width / 2) * Math.sin(this.angle - (Math.PI / 2)));
  }

  /**
   * @returns {number} 
   */
  get xTopRight() {
    return this.xTopCenter + ((this.width / 2) * Math.cos(this.angle + (Math.PI / 2)));
  }

  /**
   * @returns {number} 
   */
  get yTopRight() {
    return this.yTopCenter + ((this.width / 2) * Math.sin(this.angle + (Math.PI / 2)));
  }

  /**
   * @returns {NormalizedBaseCoordinates} 
   */
  baseCoordinates5() {
    let x = this.xBottomCenter + (0.5 * Math.cos(this.angle));
    let y = this.yBottomCenter + (0.5 * Math.sin(this.angle));
    x += ((this.width / 2) - 0.5) * Math.cos(this.angle - (Math.PI / 2));
    y += ((this.width / 2) - 0.5) * Math.sin(this.angle - (Math.PI / 2));
    x -= 0.5;
    y -= 0.5;
    return new NormalizedBaseCoordinates(x, y);
  }

  /**
   * @returns {NormalizedBaseCoordinates} 
   */
  baseCoordinatesTop5() {
    let bc5 = this.baseCoordinates5();
    return new NormalizedBaseCoordinates(
      bc5.xLeft + ((this.height - 1) * Math.cos(this.angle)),
      bc5.yTop + ((this.height - 1) * Math.sin(this.angle)),
    );
  }

  /**
   * @returns {NormalizedBaseCoordinates} 
   */
  baseCoordinates3() {
    let bc5 = this.baseCoordinates5();
    return new NormalizedBaseCoordinates(
      bc5.xLeft + ((this.width - 1) * Math.cos(this.angle + (Math.PI / 2))),
      bc5.yTop + ((this.width - 1) * Math.sin(this.angle + (Math.PI / 2))),
    );
  }

  /**
   * @returns {NormalizedBaseCoordinates} 
   */
  baseCoordinatesTop3() {
    let bc3 = this.baseCoordinates3();
    return new NormalizedBaseCoordinates(
      bc3.xLeft + ((this.height - 1) * Math.cos(this.angle)),
      bc3.yTop + ((this.height - 1) * Math.sin(this.angle)),
    );
  }

  /**
   * @param {Stem} other 
   * 
   * @returns {boolean} 
   */
  isOuterTo(other) {
    return this.position5 < other.position5 && this.position3 > other.position3;
  }

  /**
   * @returns {boolean} 
   */
  isOutermostStem() {
    return this.position5 === 0;
  }

  /**
   * @returns {boolean} 
   */
  hasHairpinLoop() {
    return this.numBranches === 0;
  }

  /**
   * @returns {boolean} 
   */
  hasRoundLoop() {
    if (this.isOutermostStem()) {
      return !this._generalProps.flatOutermostLoop;
    } else {
      return this._baseProps[this.position5 - 1].loopShape === 'round';
    }
  }

  /**
   * The outermost stem never has a triangle loop.
   * 
   * @returns {boolean} 
   */
  hasTriangleLoop() {
    if (this.isOutermostStem()) {
      return false;
    } else {
      return this._baseProps[this.position5 - 1].loopShape === 'triangle';
    }
  }

  /**
   * @returns {number} 
   */
  get maxTriangleLoopBranchingAngle() {
    if (this.isOutermostStem()) {
      return Math.PI / 4;
    } else {
      return this._baseProps[this.position5 - 1].maxTriangleLoopBranchingAngle;
    }
  }

  /**
   * The outermost stem is never flipped.
   * 
   * @returns {boolean} 
   */
  isFlipped() {
    if (this.isOutermostStem()) {
      return false;
    } else {
      return this._baseProps[this.position5 - 1].flipStem;
    }
  }

  /**
   * @returns {Array<NormalizedBaseCoordinates>} 
   */
  baseCoordinates() {
    let coordinates = [];
    let step = 1 + this._generalProps.basePairPadding;
    if (!this.isOutermostStem()) {
      coordinates.push(this.baseCoordinates5());
      for (let p = this.position5 + 1; p <= this.positionTop5; p++) {
        coordinates.push(new NormalizedBaseCoordinates(
          coordinates[p - this.position5 - 1].xLeft + (step * Math.cos(this.angle)),
          coordinates[p - this.position5 - 1].yTop + (step * Math.sin(this.angle)),
        ));
      }
    }
    let it = this.loopIterator();
    let ur = it.next().value;
    let inOutermostLoop = this.isOutermostStem();
    coordinates = coordinates.concat(ur.baseCoordinates(inOutermostLoop));
    let next = it.next();
    while (!next.done) {
      let st = next.value;
      if (st.isFlipped()) {
        coordinates = coordinates.concat(st.flippedBaseCoordinates());
      } else {
        coordinates = coordinates.concat(st.baseCoordinates());
      }
      ur = it.next().value;
      coordinates = coordinates.concat(ur.baseCoordinates(inOutermostLoop));
      next = it.next();
    }
    if (!this.isOutermostStem()) {
      coordinates.push(this.baseCoordinatesTop3());
      for (let p = this.positionTop3 + 1; p <= this.position3; p++) {
        coordinates.push(new NormalizedBaseCoordinates(
          coordinates[p - this.position5 - 1].xLeft + (step * Math.cos(this.reverseAngle)),
          coordinates[p - this.position5 - 1].yTop + (step * Math.sin(this.reverseAngle)),
        ));
      }
    }
    return coordinates;
  }

  /**
   * Base coordinates are flipped across the axis formed by the bottom base pair
   * of this stem.
   * 
   * If this stem is the outermost stem, this method simply returns the unflipped
   * base coordinates.
   * 
   * @returns {Array<NormalizedBaseCoordinates>} 
   */
  flippedBaseCoordinates() {
    if (this.isOutermostStem()) {
      return this.baseCoordinates();
    } else {
      let flippedCoordinates = [];
      let coordinates = this.baseCoordinates();
      let bc5 = this.baseCoordinates5();
      let bc3 = this.baseCoordinates3();
      let axis = bc5.angleBetweenCenters(bc3);
      coordinates.forEach(bc => {
        let angle = normalizeAngle(bc5.angleBetweenCenters(bc), axis);
        let flippedAngle = axis - (angle - axis);
        let distance = bc5.distanceBetweenCenters(bc);
        flippedCoordinates.push(new NormalizedBaseCoordinates(
          bc5.xLeft + (distance * Math.cos(flippedAngle)),
          bc5.yTop + (distance * Math.sin(flippedAngle))
        ));
      });
      return flippedCoordinates;
    }
  }
}

export default Stem;
