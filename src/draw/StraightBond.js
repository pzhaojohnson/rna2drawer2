import distanceBetween from './distanceBetween';

class StraightBond {

  /**
   * @typedef {Object} StraightBond~LineCoordinates 
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
   * @returns {StraightBond~LineCoordinates} 
   */
  static _lineCoordinates(b1, b2, padding1, padding2) {
    let angle = b1.angleBetweenCenters(b2);
    return {
      x1: b1.xCenter + (padding1 * Math.cos(angle)),
      y1: b1.yCenter + (padding1 * Math.sin(angle)),
      x2: b2.xCenter - (padding2 * Math.cos(angle)),
      y2: b2.yCenter - (padding2 * Math.sin(angle)),
    };
  }

  /**
   * @param {Base} b1 
   * @param {Base} b2 
   * @param {number} padding1 
   * @param {number} padding2 
   * 
   * @returns {number} 
   */
  static _opacity(b1, b2, padding1, padding2) {
    if (padding1 + padding2 > b1.distanceBetweenCenters(b2)) {
      return 0;
    }
    return 1;
  }

  /**
   * @callback StraightBond~getBaseById 
   * @param {string} id 
   * 
   * @returns {Base} 
   */

  /**
   * Returns null if the saved state is invalid.
   * 
   * @param {StraightBond~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * @param {StraightBond~getBaseById} getBaseById 
   * 
   * @returns {StraightBond|null} 
   */
  static fromSavedState(savedState, svg, getBaseById) {}

  /**
   * @param {SVG.Doc} svg 
   * @param {Base} b1 
   * @param {Base} b2 
   * 
   * @returns {StraightBond} 
   */
  static create(svg, b1, b2) {}

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
   * Initializes the ID of the line if it is not already initialized.
   */
  _validateLine() {
    this._line.id();
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
  get padding1() {}

  /**
   * @param {number} p 
   */
  set padding1(p) {}

  /**
   * @returns {number} 
   */
  get padding2() {}

  /**
   * @param {number} p 
   */
  set padding2(p) {}

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
    let cs = StraightBond._lineCoordinates(this.base1, this.base2, padding1, padding2);
    this._line.attr({
      'x1': cs.x1,
      'y1': cs.y1,
      'x2': cs.x2,
      'y2': cs.y2,
    });
    this._setOpacity(
      StraightBond._opacity(this.base1, this.base2, padding1, padding2)
    );
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
  get stroke() {}

  /**
   * @param {string} s 
   */
  set stroke(s) {}

  /**
   * @returns {number} 
   */
  get strokeWidth() {}

  /**
   * @param {number} sw 
   */
  set strokeWidth(sw) {}

  /**
   * @returns {number} 
   */
  get opacity() {
    return this._line.attr('opacity');
  }

  /**
   * @param {number} o 
   */
  _setOpacity(o) {
    this._line.attr({ 'opacity': o });
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
   * @returns {StraightBond~SavableState} 
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

class PrimaryBond extends StraightBond {
  
  /**
   * @typedef {Object} PrimaryBond~MostRecentProps 
   * @property {number} padding1 
   * @property {number} padding2 
   * @property {string} stroke 
   * @property {number} strokeWidth 
   */

  /**
   * @returns {PrimaryBond~MostRecentProps} 
   */
  static mostRecentProps() {
    return { ...PrimaryBond._mostRecentProps };
  }

  /**
   * @param {PrimaryBond} sb 
   */
  static _applyMostRecentProps(sb) {
    let mrps = PrimaryBond.mostRecentProps();
    sb.padding1 = mrps.padding1;
    sb.padding2 = mrps.padding2;
    sb.stroke = mrps.stroke;
    sb.strokeWidth = mrps.strokeWidth;
  }

  /**
   * @param {PrimaryBond} sb 
   */
  static _copyPropsToMostRecent(sb) {
    PrimaryBond._mostRecentProps.padding1 = sb.padding1;
    PrimaryBond._mostRecentProps.padding2 = sb.padding2;
    PrimaryBond._mostRecentProps.stroke = sb.stroke;
    PrimaryBond._mostRecentProps.strokeWidth = sb.strokeWidth;
  }

  /**
   * Returns null if the saved state is invalid.
   * 
   * @param {StraightBond~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * @param {StraightBond~getBaseById} getBaseById 
   * 
   * @returns {PrimaryBond|null} 
   */
  static fromSavedState(savedState, svg, getBaseById) {
    if (savedState.className !== 'StraightBond') {
      return null;
    }
    let line = svg.findOne('#' + savedState.line);
    let b1 = getBaseById(savedState.base1);
    let b2 = getBaseById(savedState.base2);
    let pb = null;
    try {
      pb = new PrimaryBond(line, b1, b2);
    } catch (err) {
      return null;
    }
    PrimaryBond._copyPropsToMostRecent(pb);
    return pb;
  }

  /**
   * @param {SVG.Doc} svg 
   * @param {Base} b1 
   * @param {Base} b2 
   * 
   * @returns {PrimaryBond} 
   */
  static create(svg, b1, b2) {
    let cs = StraightBond._lineCoordinates(b1, b2, 8, 8);
    let line = svg.line(cs.x1, cs.y1, cs.x2, cs.y2);
    line.id();
    let sb = new PrimaryBond(line, b1, b2);
    PrimaryBond._applyMostRecentProps(sb);
    return sb;
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
    PrimaryBond._mostRecentProps.padding1 = p;
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
    PrimaryBond._mostRecentProps.padding2 = p;
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
    PrimaryBond._mostRecentProps.stroke = s;
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
    PrimaryBond._mostRecentProps.strokeWidth = sw;
  }
}

PrimaryBond._mostRecentProps = {
  padding1: 6,
  padding2: 6,
  stroke: '#808080',
  strokeWidth: 1,
};

class SecondaryBond extends StraightBond {

  /**
   * @typedef {Object} SecondaryBond~MostRecentProps 
   * @property {number} padding1 
   * @property {number} padding2 
   * @property {string} autStroke 
   * @property {string} gcStroke 
   * @property {string} gutStroke 
   * @property {number} strokeWidth 
   */

  /**
   * @returns {SecondaryBond~MostRecentProps} 
   */
  static mostRecentProps() {
    return { ...SecondaryBond._mostRecentProps };
  }

  /**
   * @param {SecondaryBond} sb 
   */
  static _applyMostRecentProps(sb) {
    let mrps = SecondaryBond.mostRecentProps();
    sb.padding1 = mrps.padding1;
    sb.padding2 = mrps.padding2;
    sb.strokeWidth = mrps.strokeWidth;
    if (sb.isAUT()) {
      sb.stroke = mrps.autStroke;
    } else if (sb.isGC()) {
      sb.stroke = mrps.gcStroke;
    } else if (sb.isGUT()) {
      sb.stroke = mrps.gutStroke;
    } else {
      sb.stroke = mrps.otherStroke;
    }
  }

  /**
   * @param {SecondaryBond} sb 
   */
  static _copyPropsToMostRecent(sb) {
    SecondaryBond._mostRecentProps.padding1 = sb.padding1;
    SecondaryBond._mostRecentProps.padding2 = sb.padding2;
    SecondaryBond._mostRecentProps.strokeWidth = sb.strokeWidth;
    if (sb.isAUT()) {
      SecondaryBond._mostRecentProps.autStroke = sb.stroke;
    } else if (sb.isGC()) {
      SecondaryBond._mostRecentProps.gcStroke = sb.stroke;
    } else if (sb.isGUT()) {
      SecondaryBond._mostRecentProps.gutStroke = sb.stroke;
    } else {
      SecondaryBond._mostRecentProps.otherStroke = sb.stroke;
    }
  }

  /**
   * Returns null if the saved state is invalid.
   * 
   * @param {StraightBond~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * @param {StraightBond~getBaseById} getBaseById 
   * 
   * @returns {SecondaryBond|null} 
   */
  static fromSavedState(savedState, svg, getBaseById) {
    if (savedState.className !== 'StraightBond') {
      return null;
    }
    let line = svg.findOne('#' + savedState.line);
    let b1 = getBaseById(savedState.base1);
    let b2 = getBaseById(savedState.base2);
    let sb = null;
    try {
      sb = new SecondaryBond(line, b1, b2);
    } catch (err) {
      return null;
    }
    SecondaryBond._copyPropsToMostRecent(sb);
    return sb;
  }

  /**
   * @param {SVG.Doc} svg 
   * @param {Base} b1 
   * @param {Base} b2 
   * 
   * @returns {SecondaryBond} 
   */
  static create(svg, b1, b2) {
    let cs = StraightBond._lineCoordinates(b1, b2, 8, 8);
    let line = svg.line(cs.x1, cs.y1, cs.x2, cs.y2);
    line.id();
    let sb = new SecondaryBond(line, b1, b2);
    SecondaryBond._applyMostRecentProps(sb);
    return sb;
  }

  /**
   * @returns {boolean} 
   */
  isAUT() {
    let l1 = this.base1.character.toUpperCase();
    let l2 = this.base2.character.toUpperCase();
    if (l1 === 'A') {
      return l2 === 'U' || l2 === 'T';
    } else if (l1 === 'U' || l1 === 'T') {
      return l2 === 'A';
    }
    return false;
  }

  /**
   * @returns {boolean} 
   */
  isGC() {
    let l1 = this.base1.character.toUpperCase();
    let l2 = this.base2.character.toUpperCase();
    if (l1 === 'G') {
      return l2 === 'C';
    } else if (l1 === 'C') {
      return l2 === 'G';
    }
    return false;
  }

  /**
   * @returns {boolean} 
   */
  isGUT() {
    let l1 = this.base1.character.toUpperCase();
    let l2 = this.base2.character.toUpperCase();
    if (l1 === 'G') {
      return l2 === 'U' || l2 === 'T';
    } else if (l1 === 'U' || l1 === 'T') {
      return l2 === 'G';
    }
    return false;
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
    SecondaryBond._mostRecentProps.padding1 = p;
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
    SecondaryBond._mostRecentProps.padding2 = p;
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
    if (this.isAUT()) {
      SecondaryBond._mostRecentProps.autStroke = s;
    } else if (this.isGC()) {
      SecondaryBond._mostRecentProps.gcStroke = s;
    } else if (this.isGUT()) {
      SecondaryBond._mostRecentProps.gutStroke = s;
    } else {
      SecondaryBond._mostRecentProps.otherStroke = s;
    }
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
    SecondaryBond._mostRecentProps.strokeWidth = sw;
  }
}

SecondaryBond._mostRecentProps = {
  padding1: 6,
  padding2: 6,
  autStroke: '#000000',
  gcStroke: '#000000',
  gutStroke: '#808080',
  otherStroke: '#808080',
  strokeWidth: 2,
};

export {
  StraightBond,
  PrimaryBond,
  SecondaryBond,
};
