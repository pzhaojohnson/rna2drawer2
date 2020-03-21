import UnpairedRegion from './UnpairedRegion';
import VirtualBaseCoordinates from '../../VirtualBaseCoordinates';

/**
 * A stack of consecutive base pairs.
 * 
 * The outermost stem of a layout is an imaginary base pair
 * between positions zero and the sequence length plus one
 * with a width that is the size of the termini gap of the layout.
 */
class Stem {

  /**
   * @param {number} p5 The 5' most position of this stem.
   * @param {Array<number|null>} partners The partners notation of the secondary structure.
   * @param {StrictLayoutGeneralProps} generalProps The drawing properties of the layout.
   * @param {Array<StrictLayoutBaseProps>} baseProps The base properties of the layout.
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

  /**
   * Initializes the _position3 property of this stem, which is the 3' most position
   * of this stem.
   */
  _initializePosition3() {
    if (this.isOutermostStem()) {
      this._position3 = this._partners.length + 1;
    } else {
      this._position3 = this._partners[this._position5 - 1];
    }
  }

  /**
   * Initializes the _size property of this stem, which is the number of base pairs
   * in this stem.
   */
  _initializeSize() {
    if (this.isOutermostStem()) {
      this._size = 1;
    } else {
      let partners = this._partners;
      let p = this.position5;
      let q = this.position3;
      
      function nextPair() {
        let r = p + 1;
        let s = partners[r - 1];
        return r < s && s !== null && s === q - 1;
      }

      while (nextPair()) {
        p++;
        q--;
      }

      this._size = p - this.position5 + 1;
    }
  }

  /**
   * Initializes the _loop property of this stem, which is an array of the unpaired regions and stems
   * in the loop of this stem sorted in ascending order by position.
   */
  _initializeLoop() {
    this._loop = [];
    let bst5 = this;
    let p = this.position5 + this.size;

    while (this._partners[p - 1] === null) {
      p++;
    }

    while (p < this.positionTop3) {
      let bst3 = new Stem(p, this._partners, this._generalProps, this._baseProps);
      this._loop.push(new UnpairedRegion(bst5, bst3, this._partners, this._generalProps, this._baseProps));
      this._loop.push(bst3);

      bst5 = bst3;
      p = bst5.position3 + 1;

      while (this._partners[p - 1] === null) {
        p++;
      }
    }

    // add the last unpaired region
    this._loop.push(new UnpairedRegion(bst5, this, this._partners, this._generalProps, this._baseProps));
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
   * @returns {object} An iterator for the loop of this stem.
   */
  loopIterator() {
    return this._loop[Symbol.iterator]();
  }

  /**
   * Acessing this property takes time linear wrt the size of the loop of this stem.
   * 
   * @returns {number} The number of stems in the loop of this stem.
   */
  get numBranches() {
    let it = this.loopIterator();
    let num = 0;

    // skip first unpaired region
    it.next();

    let next = it.next();

    while (!next.done) {
      num++;
      
      // skip unpaired region
      it.next();

      next = it.next();
    }

    return num;
  }

  /**
   * @returns {number} The X coordinate of the bottom center of this stem.
   */
  get xBottomCenter() {
    return this._xBottomCenter;
  }

  set xBottomCenter(x) {
    this._xBottomCenter = x;
  }

  /**
   * @returns {number} The Y coordinate of the bottom center of this stem.
   */
  get yBottomCenter() {
    return this._yBottomCenter;
  }

  set yBottomCenter(y) {
    this._yBottomCenter = y;
  }

  /**
   * @returns {number} The angle of this stem from bottom to top.
   */
  get angle() {
    return this._angle;
  }

  set angle(a) {
    this._angle = a;
  }

  /**
   * @returns {number} The angle of this stem from top to bottom.
   */
  get reverseAngle() {
    return this.angle + Math.PI;
  }

  /**
   * @returns {number} The distance between the 5' and 3' sides of this stem.
   */
  get width() {
    if (this.isOutermostStem()) {
      return this._generalProps.terminiGap;
    } else {
      return 2 + this._generalProps.basePairBondLength;
    }
  }

  /**
   * @returns {number} 
   */
  get loopLength() {
    let it = this.loopIterator();
    let ll = 0;

    // first unpaired region
    let next = it.next();
    ll += next.value.length;
    next = it.next();

    while (!next.done) {

      // stem
      ll += next.value.width;

      // unpaired region
      next = it.next();
      ll += next.value.length;

      next = it.next();
    }

    return ll;
  }

  /**
   * For now this is simply the size of this stem, but this may depend on other properties in the future.
   * 
   * @returns {number} The distance between the bottom and top sides of this stem.
   */
  get height() {
    return this.size + ((this.size - 1) * this._generalProps.basePairPadding);
  }

  /**
   * @returns {number} The X coordinate of the top center of this stem.
   */
  get xTopCenter() {
    return this.xBottomCenter + (Math.cos(this.angle) * this.height);
  }

  /**
   * @returns {number} The Y coordinate of the top center of this stem.
   */
  get yTopCenter() {
    return this.yBottomCenter + (Math.sin(this.angle) * this.height);
  }

  /**
   * @returns {number} The X coordinate of the bottom left corner of this stem.
   */
  get xBottomLeft() {
    return this.xBottomCenter + ((this.width / 2) * Math.cos(this.angle - (Math.PI / 2)));
  }

  /**
   * @returns {number} The Y coordinate of the bottom left corner of this stem.
   */
  get yBottomLeft() {
    return this.yBottomCenter + ((this.width / 2) * Math.sin(this.angle - (Math.PI / 2)));
  }

  /**
   * @returns {number} The X coordinate of the bottom right corner of this stem.
   */
  get xBottomRight() {
    return this.xBottomCenter + ((this.width / 2) * Math.cos(this.angle + (Math.PI / 2)));
  }

  /**
   * @returns {number} The Y coordinate of the bottom right corner of this stem.
   */
  get yBottomRight() {
    return this.yBottomCenter + ((this.width / 2) * Math.sin(this.angle + (Math.PI / 2)));
  }

  /**
   * @returns {number} The X coordinate of the top left corner of this stem.
   */
  get xTopLeft() {
    return this.xTopCenter + ((this.width / 2) * Math.cos(this.angle - (Math.PI / 2)));
  }

  /**
   * @returns {number} The Y coordinate of the top left corner of this stem.
   */
  get yTopLeft() {
    return this.yTopCenter + ((this.width / 2) * Math.sin(this.angle - (Math.PI / 2)));
  }

  /**
   * @returns {number} The X coordinate of the top right corner of this stem.
   */
  get xTopRight() {
    return this.xTopCenter + ((this.width / 2) * Math.cos(this.angle + (Math.PI / 2)));
  }

  /**
   * @returns {number} The Y coordinate of the top right corner of this stem.
   */
  get yTopRight() {
    return this.yTopCenter + ((this.width / 2) * Math.sin(this.angle + (Math.PI / 2)));
  }

  /**
   * @returns {VirtualBaseCoordinates} The base coordinates of the 5' most position of this stem.
   */
  baseCoordinates5() {
    let x = this.xBottomCenter + (0.5 * Math.cos(this.angle));
    let y = this.yBottomCenter + (0.5 * Math.sin(this.angle));
    x += ((this.width / 2) - 0.5) * Math.cos(this.angle - (Math.PI / 2));
    y += ((this.width / 2) - 0.5) * Math.sin(this.angle - (Math.PI / 2));
    x -= 0.5;
    y -= 0.5;
    return new VirtualBaseCoordinates(x, y);
  }

  /**
   * @returns {VirtualBaseCoordinates} The base coordinates of the 5' position of the top base pair of this stem.
   */
  baseCoordinatesTop5() {
    let bc5 = this.baseCoordinates5();
    return new VirtualBaseCoordinates(
      bc5.xLeft + ((this.height - 1) * Math.cos(this.angle)),
      bc5.yTop + ((this.height - 1) * Math.sin(this.angle)),
    );
  }

  /**
   * @returns {VirtualBaseCoordinates} The base coordinates of the 3' most position of this stem.
   */
  baseCoordinates3() {
    let bc5 = this.baseCoordinates5();
    return new VirtualBaseCoordinates(
      bc5.xLeft + ((this.width - 1) * Math.cos(this.angle + (Math.PI / 2))),
      bc5.yTop + ((this.width - 1) * Math.sin(this.angle + (Math.PI / 2))),
    );
  }

  /**
   * @returns {VirtualBaseCoordinates} The base coordinates of the 3' position of the top base pair of this stem.
   */
  baseCoordinatesTop3() {
    let bc3 = this.baseCoordinates3();
    return new VirtualBaseCoordinates(
      bc3.xLeft + ((this.height - 1) * Math.cos(this.angle)),
      bc3.yTop + ((this.height - 1) * Math.sin(this.angle)),
    );
  }

  /**
   * @param {Stem} other 
   * 
   * @returns {boolean} True if this stem is outer to the other stem.
   */
  isOuterTo(other) {
    return this.position5 < other.position5 && this.position3 > other.position3;
  }

  /**
   * @returns {boolean} True if this stem is the outermost stem of the layout.
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
   * @returns {boolean} True if this stem has a round loop.
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
   * @returns {boolean} True if this stem has a triangle loop.
   */
  hasTriangleLoop() {
    if (this.isOutermostStem()) {
      return false;
    } else {
      return this._baseProps[this.position5 - 1].loopShape === 'triangle';
    }
  }

  get maxTriangleLoopAngle() {
    if (this.isOutermostStem()) {
      return Math.PI / 4;
    } else {
      return this._baseProps[this.position5 - 1].maxTriangleLoopAngle;
    }
  }

  /**
   * The outermost stem is never flipped.
   * 
   * @returns {boolean} True if this stem is flipped.
   */
  isFlipped() {
    if (this.isOutermostStem()) {
      return false;
    } else {
      return this._baseProps[this.position5 - 1].flipStem;
    }
  }

  /**
   * @returns {Array<VirtualBaseCoordinates>} 
   */
  baseCoordinates() {
    let coordinates = [];

    if (!this.isOutermostStem()) {
      coordinates.push(this.baseCoordinates5());
      for (let p = this.position5 + 1; p <= this.positionTop5; p++) {
        coordinates.push(new VirtualBaseCoordinates(
          coordinates[p - this.position5 - 1].xLeft + Math.cos(this.angle),
          coordinates[p - this.position5 - 1].yTop + Math.sin(this.angle),
        ));
      }
    }

    let it = this.loopIterator();
    let inOutermostLoop = this.isOutermostStem();
    
    let ur = it.next().value;
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
        coordinates.push(new VirtualBaseCoordinates(
          coordinates[p - this.position5 - 1].xLeft + Math.cos(this.reverseAngle),
          coordinates[p - this.position5 - 1].yTop + Math.sin(this.reverseAngle),
        ));
      }
    }

    return coordinates;
  }

  /**
   * @returns {Array<VirtualBaseCoordinates>} The base coordinates of all positions encompassed by this stem
   *  flipped along the axis formed by the bottom base pair of this stem.
   */
  flippedBaseCoordinates() {
    let coordinates = this.baseCoordinates();
    let flippedCoordinates = [];
    
    let bc5 = this.baseCoordinates5();
    let bc3 = this.baseCoordinates3();
    let axis = bc5.angleBetweenCenters(bc3);
    
    coordinates.forEach(bc => {
      let angle = normalizeAngle(bc5.angleBetweenCenters(bc), axis);
      let flippedAngle = axis - (angle - axis);
      let distance = bc5.distanceBetweenCenters(bc);

      flippedCoordinates.push(new VirtualBaseCoordinates(
        bc5.xLeft + (distance * Math.cos(flippedAngle)),
        bc5.yTop + (distance * Math.sin(flippedAngle))
      ));
    });

    return flippedCoordinates;
  }
}

export default Stem;
