import StemInterface from './StemInterface';
import UnpairedRegion from './UnpairedRegion';
import NormalizedBaseCoordinates from '../../NormalizedBaseCoordinates';
import normalizeAngle from '../../../normalizeAngle';
import GeneralStrictLayoutProps from './GeneralStrictLayoutProps';
import PerBaseStrictLayoutProps from './PerBaseStrictLayoutProps';

/**
 * The outermost stem of a layout is an imaginary base pair between positions
 * zero and the sequence length plus one and is meant as a convenient way to
 * store the entire recursive structure in one object. The coordinates and angle
 * of the outermost stem should have no influence on the rest of the layout.
 */
class Stem implements StemInterface {
  _partners: (number | null)[];
  _generalProps: GeneralStrictLayoutProps;
  _perBaseProps: PerBaseStrictLayoutProps[];

  _position5: number;
  _position3!: number;
  _size!: number;

  _xBottomCenter: number;
  _yBottomCenter: number;
  _angle: number;

  _loop!: (UnpairedRegion | Stem)[];

  static width(generalProps: GeneralStrictLayoutProps): number {
    return generalProps.stemWidth;
  }

  /**
   * p5 is the 5' most position of this stem.
   */
  constructor(
    p5: number,
    partners: (number | null)[],
    generalProps: GeneralStrictLayoutProps,
    perBaseProps: PerBaseStrictLayoutProps[],
  ) {
    this._partners = partners;
    this._generalProps = generalProps;
    this._perBaseProps = perBaseProps;
    
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
      this._position3 = this._partners[this._position5 - 1] as number;
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
   * Throws if a knot is encountered.
   */
  _initializeLoop(): (void | never) {
    this._loop = [];
    let partners = this._partners;
    let gps = this._generalProps;
    let pbps = this._perBaseProps;
    let bst5 = this as Stem;
    let p = this.position5 + this.size;
    while (partners[p - 1] == null && p < this.positionTop3) {
      p++;
    }
    while (p < this.positionTop3) {
      if ((partners[p - 1] as number) < p) {
        throw new Error('Knot encountered in loop.');
      }
      let bst3 = new Stem(p, partners, gps, pbps);
      this._loop.push(new UnpairedRegion(bst5, bst3, partners, gps, pbps));
      this._loop.push(bst3);
      bst5 = bst3;
      p = bst5.position3 + 1;
      while (partners[p - 1] == null && p < this.positionTop3) {
        p++;
      }
    }
    this._loop.push(new UnpairedRegion(bst5, this, partners, gps, pbps));
  }

  /**
   * The 5' most position of the stem.
   * 
   * The 5' most position of the outermost stem is zero.
   */
  get position5(): number {
    return this._position5;
  }

  /**
   * The 3' most position of the stem.
   * 
   * The 3' most position of the outermost stem is the sequence length plus one.
   */
  get position3(): number {
    return this._position3;
  }

  /**
   * The 5' position of the top base pair of this stem.
   */
  get positionTop5(): number {
    return this.position5 + this.size - 1;
  }

  /**
   * The 3' position of the top base pair of this stem.
   */
  get positionTop3(): number {
    return this.position3 - this.size + 1;
  }

  /**
   * The number of base pairs in this stem.
   * 
   * The size of the outermost stem is one.
   */
  get size(): number {
    return this._size;
  }

  loopIterator() {
    return this._loop[Symbol.iterator]();
  }

  /**
   * The number of stems in the loop of this stem.
   */
  get numBranches(): number {
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

  get firstUnpairedRegionInLoop(): UnpairedRegion {
    let it = this.loopIterator();
    return it.next().value;
  }

  get lastUnpairedRegionInLoop(): UnpairedRegion {
    let it = this.loopIterator();
    let next = it.next();
    let value;
    while (!next.done) {
      value = next.value;
      next = it.next();
    }
    return value as UnpairedRegion;
  }

  unpairedRegionsInLoop(): UnpairedRegion[] {
    let urs = [];
    let it = this.loopIterator();
    urs.push(it.next().value);
    let next = it.next();
    while (!next.done) {
      urs.push(it.next().value);
      next = it.next();
    }
    return urs;
  }

  /**
   * Returns null if the loop contains no stems.
   */
  get firstStemInLoop(): (Stem | null) {
    if (this.numBranches === 0) {
      return null;
    }
    let it = this.loopIterator();
    it.next();
    return it.next().value;
  }

  /**
   * Returns null if the loop contains no stems.
   */
  get lastStemInLoop(): (Stem | null) {
    if (this.numBranches === 0) {
      return null;
    }
    let it = this.loopIterator();
    it.next();
    let st = null;
    let next = it.next();
    while (!next.done) {
      st = next.value as Stem;
      it.next();
      next = it.next();
    }
    return st;
  }

  stemsInLoop(): Stem[] {
    let sts = [];
    let it = this.loopIterator();
    it.next();
    let next = it.next();
    while (!next.done) {
      sts.push(next.value as Stem);
      it.next();
      next = it.next();
    }
    return sts;
  }

  get xBottomCenter(): number {
    return this._xBottomCenter;
  }

  set xBottomCenter(x: number) {
    this._xBottomCenter = x;
  }

  get yBottomCenter(): number {
    return this._yBottomCenter;
  }

  set yBottomCenter(y: number) {
    this._yBottomCenter = y;
  }

  /**
   * The angle of this stem from bottom to top.
   */
  get angle(): number {
    return this._angle;
  }

  set angle(a: number) {
    this._angle = a;
  }

  /**
   * The angle of this stem from top to bottom.
   */
  get reverseAngle(): number {
    return this.angle + Math.PI;
  }

  get width(): number {
    return Stem.width(this._generalProps);
  }

  get height(): number {
    let basePairPadding = this._generalProps.basePairPadding;
    return this.size + ((this.size - 1) * basePairPadding);
  }

  get loopLength(): number {
    let ll = 0;
    let it = this.loopIterator();
    let next = it.next();
    ll += next.value.length;
    next = it.next();
    while (!next.done) {
      ll += (next.value as Stem).width;
      next = it.next();
      ll += (next.value as UnpairedRegion).length;
      next = it.next();
    }
    return ll;
  }

  get xTopCenter(): number {
    return this.xBottomCenter + (Math.cos(this.angle) * this.height);
  }

  get yTopCenter(): number {
    return this.yBottomCenter + (Math.sin(this.angle) * this.height);
  }

  get xBottomLeft(): number {
    return this.xBottomCenter + ((this.width / 2) * Math.cos(this.angle - (Math.PI / 2)));
  }

  get yBottomLeft(): number {
    return this.yBottomCenter + ((this.width / 2) * Math.sin(this.angle - (Math.PI / 2)));
  }

  get xBottomRight(): number {
    return this.xBottomCenter + ((this.width / 2) * Math.cos(this.angle + (Math.PI / 2)));
  }

  get yBottomRight(): number {
    return this.yBottomCenter + ((this.width / 2) * Math.sin(this.angle + (Math.PI / 2)));
  }

  get xTopLeft(): number {
    return this.xTopCenter + ((this.width / 2) * Math.cos(this.angle - (Math.PI / 2)));
  }

  get yTopLeft(): number {
    return this.yTopCenter + ((this.width / 2) * Math.sin(this.angle - (Math.PI / 2)));
  }

  get xTopRight(): number {
    return this.xTopCenter + ((this.width / 2) * Math.cos(this.angle + (Math.PI / 2)));
  }

  get yTopRight(): number {
    return this.yTopCenter + ((this.width / 2) * Math.sin(this.angle + (Math.PI / 2)));
  }

  baseCoordinates5(): NormalizedBaseCoordinates {
    let x = this.xBottomCenter + (0.5 * Math.cos(this.angle));
    let y = this.yBottomCenter + (0.5 * Math.sin(this.angle));
    x += ((this.width / 2) - 0.5) * Math.cos(this.angle - (Math.PI / 2));
    y += ((this.width / 2) - 0.5) * Math.sin(this.angle - (Math.PI / 2));
    x -= 0.5;
    y -= 0.5;
    return new NormalizedBaseCoordinates(x, y);
  }

  baseCoordinatesTop5(): NormalizedBaseCoordinates {
    let bc5 = this.baseCoordinates5();
    return new NormalizedBaseCoordinates(
      bc5.xLeft + ((this.height - 1) * Math.cos(this.angle)),
      bc5.yTop + ((this.height - 1) * Math.sin(this.angle)),
    );
  }

  baseCoordinates3(): NormalizedBaseCoordinates {
    let bc5 = this.baseCoordinates5();
    return new NormalizedBaseCoordinates(
      bc5.xLeft + ((this.width - 1) * Math.cos(this.angle + (Math.PI / 2))),
      bc5.yTop + ((this.width - 1) * Math.sin(this.angle + (Math.PI / 2))),
    );
  }

  baseCoordinatesTop3(): NormalizedBaseCoordinates {
    let bc3 = this.baseCoordinates3();
    return new NormalizedBaseCoordinates(
      bc3.xLeft + ((this.height - 1) * Math.cos(this.angle)),
      bc3.yTop + ((this.height - 1) * Math.sin(this.angle)),
    );
  }

  isOuterTo(other: Stem): boolean {
    return this.position5 < other.position5 && this.position3 > other.position3;
  }

  isOutermostStem(): boolean {
    return this.position5 === 0;
  }

  hasHairpinLoop(): boolean {
    return this.numBranches === 0;
  }

  hasRoundLoop(): boolean {
    if (this.isOutermostStem()) {
      return this._generalProps.outermostLoopShape !== 'flat';
    } else {
      return this._perBaseProps[this.position5 - 1].loopShape === 'round';
    }
  }

  /**
   * The outermost stem never has a triangle loop.
   */
  hasTriangleLoop(): boolean {
    if (this.isOutermostStem()) {
      return false;
    } else {
      return this._perBaseProps[this.position5 - 1].loopShape === 'triangle';
    }
  }

  get triangleLoopHeight(): number {
    if (this.isOutermostStem()) {
      return 0;
    }
    return this._perBaseProps[this.position5 - 1].triangleLoopHeight;
  }

  /**
   * The outermost stem is never flipped.
   */
  isFlipped(): boolean {
    if (this.isOutermostStem()) {
      return false;
    } else {
      return this._perBaseProps[this.position5 - 1].flipStem;
    }
  }

  baseCoordinates(): NormalizedBaseCoordinates[] {
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
      let st = next.value as Stem;
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
   */
  flippedBaseCoordinates(): NormalizedBaseCoordinates[] {
    if (this.isOutermostStem()) {
      return this.baseCoordinates();
    } else {
      let flippedCoordinates = [] as NormalizedBaseCoordinates[];
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
