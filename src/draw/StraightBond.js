import distanceBetween from './distanceBetween';
import createUUIDforSVG from './createUUIDforSVG';

class StraightBond {

  /**
   * @callback StraightBond~getBaseById 
   * @param {string} id 
   * 
   * @returns {Base} 
   */

  /**
   * @param {StraightBond~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * @param {StraightBond~getBaseById} getBaseById 
   * 
   * @throws {Error} If the saved state is not for a straight bond.
   */
  static fromSavedState(savedState, svg, getBaseById) {
    if (savedState.className !== 'StraightBond') {
      throw new Error('Saved state is not for a straight bond.');
    }

    let line = svg.findOne('#' + savedState.line);
    let b1 = getBaseById(savedState.base1);
    let b2 = getBaseById(savedState.base2);
    return new StraightBond(line, b1, b2);
  }

  /**
   * @typedef {Object} StraightBond~Coordinates 
   * @property {number} x1 
   * @property {number} y1 
   * @property {number} x2 
   * @property {number} y2 
   */

  /**
   * @param {Base} b1 
   * @param {Base} b2 
   * @param {number} padding1 
   * @param {number} padding2 
   * 
   * @returns {StraightBond~Coordinates} The coordinates of the line of a straight bond.
   */
  static coordinates(b1, b2, padding1, padding2) {
    if (padding1 + padding2 >= b1.distanceBetweenCenters(b2)) {
      let x = (b1.xCenter + b2.xCenter) / 2;
      let y = (b1.yCenter + b2.yCenter) / 2;

      return {
        x1: x,
        y1: y,
        x2: x,
        y2: y,
      };
    } else {
      let angle = b1.angleBetweenCenters(b2);

      return {
        x1: b1.xCenter + (padding1 * Math.cos(angle)),
        y1: b1.yCenter + (padding1 * Math.sin(angle)),
        x2: b2.xCenter - (padding2 * Math.cos(angle)),
        y2: b2.yCenter - (padding2 * Math.sin(angle)),
      };
    }
  }

  /**
   * @param {SVG.Doc} svg 
   * @param {Base} b1 
   * @param {Base} b2 
   * 
   * @returns {StraightBond} 
   */
  static create(svg, b1, b2) {
    let cs = StraightBond.coordinates(b1, b2, 8, 8);
    let line = svg.line(cs.x1, cs.y1, cs.x2, cs.y2);
    line.id(createUUIDforSVG());
    return new StraightBond(line, b1, b2);
  }

  /**
   * @param {SVG.Doc} svg 
   * @param {Base} b1 
   * @param {Base} b2 
   * 
   * @returns {StraightBond} 
   */
  static createStrand(svg, b1, b2) {
    let sb = StraightBond.create(svg, b1, b2);
    sb.applyStrandDefaults();
    return sb;
  }

  /**
   * @param {SVG.Doc} svg 
   * @param {Base} b1 
   * @param {Base} b2 
   * 
   * @returns {StraightBond} 
   */
  static createWatsonCrick(svg, b1, b2) {
    let sb = StraightBond.create(svg, b1, b2);
    sb.applyWatsonCrickDefaults();
    return sb;
  }

  /**
   * @param {SVG.Line} line 
   * @param {Base} b1 One base of the straight bond.
   * @param {Base} b2 The other base of the straight bond.
   */
  constructor(line, b1, b2) {
    this._base1 = b1;
    this._base2 = b2;
    
    this._line = line;
    this._validateLine();

    this._storePaddings();
  }

  /**
   * @throws {Error} If the ID of the line is not a string or is an empty string.
   */
  _validateLine() {
    if (typeof(this._line.id()) !== 'string' || this._line.id().length === 0) {
      throw new Error('Invalid line ID.');
    }
  }

  /**
   * @returns {Base} 
   */
  get base1() {
    return this._base1;
  }

  /**
   * @returns {Base} 
   */
  get base2() {
    return this._base2;
  }

  /**
   * @returns {boolean} 
   */
  isAUT() {
    let l1 = this.base1.letter.toUpperCase();
    let l2 = this.base2.letter.toUpperCase();

    if (l1 === 'A') {
      return l2 === 'U' || l2 === 'T';
    } else if (l1 === 'U' || l1 === 'T') {
      return l2 === 'A';
    } else {
      return false;
    }
  }

  /**
   * @returns {boolean} 
   */
  isGC() {
    let l1 = this.base1.letter.toUpperCase();
    let l2 = this.base2.letter.toUpperCase();

    if (l1 === 'G') {
      return this.l2 === 'C';
    } else if (l1 === 'C') {
      return l2 === 'G';
    } else {
      return false;
    }
  }

  /**
   * @returns {boolean} 
   */
  isGUT() {
    let l1 = this.base1.letter.toUpperCase();
    let l2 = this.base2.letter.toUpperCase();

    if (l1 === 'G') {
      return l2 === 'U' || l2 === 'T';
    } else if (l1 === 'U' || l1 === 'T') {
      return l2 === 'G';
    } else {
      return false;
    }
  }

  /**
   * @returns {string} 
   */
  get id() {
    return this._line.attr('id');
  }

  /**
   * Sets the _padding1 and _padding2 properties based on the current positions
   * of the bases and line of this straight bond.
   */
  _storePaddings() {
    this._padding1 = distanceBetween(
      this.base1.xCenter,
      this.base1.yCenter,
      this._line.attr('x1'),
      this._line.attr('y1'),
    );

    this._padding2 = distanceBetween(
      this.base2.xCenter,
      this.base2.yCenter,
      this._line.attr('x2'),
      this._line.attr('y2'),
    );
  }

  /**
   * @returns {number} 
   */
  get padding1() {
    return this._padding1;
  }

  /**
   * @param {number} p 
   */
  set padding1(p) {
    this._reposition(p, this.padding2);
  }

  /**
   * @returns {number} 
   */
  get padding2() {
    return this._padding2;
  }

  /**
   * @param {number} p 
   */
  set padding2(p) {
    this._reposition(this.padding1, p);
  }

  /**
   * Repositions the line of this straight bond based on the current positions
   * of the bases of this straight bond.
   */
  reposition() {
    this._reposition(this.padding1, this.padding2);
  }

  /**
   * Repositions the line of this straight bond based on the current positions
   * of the bases of this straight bond and the given paddings.
   * 
   * @param {number} padding1 
   * @param {number} padding2 
   */
  _reposition(padding1, padding2) {
    let cs = StraightBond.coordinates(this.base1, this.base2, padding1, padding2);
    
    this._line.attr({
      'x1': cs.x1,
      'y1': cs.y1,
      'x2': cs.x2,
      'y2': cs.y2,
    });

    this._storePaddings();
  }

  /**
   * Inserts the line of this straight bond before the given element.
   * 
   * @param {SVG.Element} ele 
   */
  insertBefore(ele) {
    this._line.insertBefore(ele);
  }

  /**
   * Inserts the line of this straight bond after the given element.
   * 
   * @param {SVG.Element} ele 
   */
  insertAfter(ele) {
    this._line.insertAfter(ele);
  }

  /**
   * @returns {string} 
   */
  get stroke() {
    return this._line.attr('stroke');
  }

  /**
   * @param {string} s 
   */
  set stroke(s) {
    this._line.attr({ 'stroke': s });
  }

  /**
   * @returns {number} 
   */
  get strokeWidth() {
    return this._line.attr('stroke-width');
  }

  /**
   * @param {number} sw 
   */
  set strokeWidth(sw) {
    this._line.attr({ 'stroke-width': sw });
  }

  applyStrandDefaults() {
    this.padding = StraightBond.defaults.strand.padding;
    this.stroke = StraightBond.defaults.strand.stroke;
    this.strokeWidth = StraightBond.defaults.strand.strokeWidth;
  }

  applyWatsonCrickDefaults() {
    this.padding = StraightBond.defaults.watsonCrick.padding;
    
    if (sb.isAUT()) {
      this.stroke = StraightBond.defaults.watsonCrick.autStroke;
    } else if (sb.isGC()) {
      this.stroke = StraightBond.defaults.watsonCrick.gcStroke;
    } else if (sb.isGUT()) {
      this.stroke = StraightBond.defaults.watsonCrick.gutStroke;
    } else {
      this.stroke = StraightBond.defaults.watsonCrick.otherStroke;
    }

    this.strokeWidth = StraightBond.defaults.watsonCrick.strokeWidth;
  }

  remove() {
    this._line.remove();
  }

  /**
   * @typedef {Object} StraightBond~SavableState 
   * @property {string} className 
   * @property {string} line 
   * @property {string} base1 
   * @property {string} base2 
   */

  /**
   * @returns {Object} 
   */
  savableState() {
    return {
      className: 'StraightBond',
      line: this._line.id(),
      base1: this.base1.id,
      base2: this.base2.id,
    };
  }
}

StraightBond.defaults = {
  strand: {
    padding: 6,
    stroke: '#808080',
    strokeWidth: 1,
  },
  watsonCrick: {
    padding: 6,
    autStroke: '#000000',
    gcStroke: '#000000',
    gutStroke: '#808080',
    otherStroke: '#808080',
    strokeWidth: 2,
  },
};

export default StraightBond;
