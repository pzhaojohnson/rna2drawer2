import Stem from './Stem';
import { StemLayout } from './StemLayout';
import isKnotless from '../../../../parse/isKnotless';

class StrictLayout {

  /**
   * @param {Array<number|null>} partners The partners notation of the secondary structure of the layout.
   * @param {StrictLayoutDrawingProps} drawingProps The drawing properties of the layout.
   * @param {Array<StrictLayoutBaseProps>} baseProps The base properties of the layout.
   */
  constructor(partners, drawingProps, baseProps) {
    this._partners = partners;
    this._validatePartners();
    
    this._drawingProps = drawingProps;
    
    this._baseProps = baseProps;
    this._validateBaseProps();
    
    this._outermostStem = new Stem(0, this._partners, this._drawingProps, this._baseProps);
    StemLayout.setCoordinatesAndAngles(this._outermostStem, this._drawingProps, this._baseProps);
    this._baseCoordinates = this._outermostStem.baseCoordinates();
  }
  
  /**
   * Validates the _partners property of this layout, which is the partners notation of
   * the secondary structure of this layout.
   * 
   * @throws {Error} If the partners notation has a length of zero.
   * @throws {Error} If the specified secondary structure contains knots.
   */
  _validatePartners() {
    if (this._partners.length === 0) {
      throw new Error('Empty partners notation.');
    }
    
    if (!isKnotless(this._partners)) {
      throw new Error('The secondary structure of this layout contains knots.');
    }
  }
  
  /**
   * Validates the _baseProps properties of this layout.
   * 
   * @throws {Error} If the length of the partners notation of this layout does not match
   *  the number of base properties objects.
   */
  _validateBaseProps() {
    if (this._partners.length !== this._baseProps.length) {
      throw new Error('Base properties must be given for every position.');
    }
  }

  /**
   * @param {number} p 
   * 
   * @returns {VirtualBaseCoordinates} The base coordinates of a given position.
   */
  baseCoordinates(p) {
    return this._baseCoordinates[p - 1];
  }

  /**
   * @returns {Stem} The outermost stem of this layout.
   */
  get outermostStem() {
    return this._outermostStem;
  }

  /**
   * Accessing this property is linear wrt the length of the sequence.
   * 
   * @returns {number} The minimum X coordinate of the bases in this layout.
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
   * Accessing this property is linear wrt the length of the sequence.
   * 
   * @returns {number} The maximum X coordinate of the bases in this layout.
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
   * Accessing this property is linear wrt the length of the sequence.
   * 
   * @returns {number} The X coordinate of the center of this layout.
   */
  get xCenter() {
    return (this.xMin() + this.xMax()) / 2.0;
  }

  /**
   * Accessing this property is linear wrt the length of the sequence.
   * 
   * @returns {number} The minimum Y coordinate of the bases in this layout.
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
   * Accessing this property is linear wrt the length of the sequence.
   * 
   * @returns {number} The maximum Y coordinate of the bases in this layout.
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
   * Accessing this property is linear wrt the length of the sequence.
   * 
   * @returns {number} The Y coordinate of the center of this layout.
   */
  get yCenter() {
    return (this.yMin() + this.yMax()) / 2.0;
  }

  /**
   * Accessing this property is linear wrt the length of the sequence.
   * 
   * @returns {number} The width of this layout.
   */
  get width() {
    return this.xMax() - this.xMin();
  }

  /**
   * Accessing this property is linear wrt the length of the sequence.
   * 
   * @returns {number} The height of this layout.
   */
  get height() {
    return this.yMax() - this.yMin();
  }

  /**
   * @param {number} p 
   * 
   * @returns {StrictLayoutBaseProps} The base properties for a given position.
   */
  baseProps(p) {
    return this.seq.getBase(p).strictLayoutProps;
  }
}

export default StrictLayout;
