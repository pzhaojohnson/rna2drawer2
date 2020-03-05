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
   * @throws {Error} If the saved state is not for the correct straight bond.
   */
  static fromSavedState(savedState, svg, getBaseById) {
    throw new Error('Not implemented.');
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
    throw new Error('Not implemented.');
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
    throw new Error('Not implemented.');
  }

  /**
   * @param {number} p 
   */
  set padding1(p) {
    throw new Error('Not implemented.');
  }

  /**
   * @returns {number} 
   */
  get padding2() {
    throw new Error('Not implemented.');
  }

  /**
   * @param {number} p 
   */
  set padding2(p) {
    throw new Error('Not implemented.');
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
    throw new Error('Not implemented.');
  }

  /**
   * @param {string} s 
   */
  set stroke(s) {
    throw new Error('Not implemented.');
  }

  /**
   * @returns {number} 
   */
  get strokeWidth() {
    throw new Error('Not implemented.');
  }

  /**
   * @param {number} sw 
   */
  set strokeWidth(sw) {
    throw new Error('Not implemented.');
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
    throw new Error('Not implemented.');
  }
}

class StrandBond extends StraightBond {
  
  /**
   * @typedef {Object} StrandBond~MostRecentProps 
   * @property {number} padding1 
   * @property {number} padding2 
   * @property {string} stroke 
   * @property {number} strokeWidth 
   */

  /**
   * @returns {StrandBond~MostRecentProps} 
   */
  static mostRecentProps() {
    return { ...StrandBond._mostRecentProps };
  }

  /**
   * @param {StrandBond} sb 
   */
  static _applyMostRecentProps(sb) {
    let mrps = StrandBond.mostRecentProps();
    sb.padding1 = mrps.padding1;
    sb.padding2 = mrps.padding2;
    sb.stroke = mrps.stroke;
    sb.strokeWidth = mrps.strokeWidth;
  }

  /**
   * @param {StrandBond} sb 
   */
  static _copyPropsToMostRecent(sb) {
    StrandBond._mostRecentProps.padding1 = sb.padding1;
    StrandBond._mostRecentProps.padding2 = sb.padding2;
    StrandBond._mostRecentProps.stroke = sb.stroke;
    StrandBond._mostRecentProps.strokeWidth = sb.strokeWidth;
  }

  /**
   * @param {StraightBond~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * @param {StraightBond~getBaseById} getBaseById 
   * 
   * @throws {Error} If the saved state is not for a strand bond.
   */
  static fromSavedState(savedState, svg, getBaseById) {
    if (savedState.className !== 'StrandBond') {
      throw new Error('Saved state is not for a strand bond.');
    }

    let line = svg.findOne('#' + savedState.line);
    let b1 = getBaseById(savedState.base1);
    let b2 = getBaseById(savedState.base2);
    let sb = new StrandBond(line, b1, b2);

    StrandBond._copyPropsToMostRecent(sb);
    return sb;
  }

  /**
   * @param {SVG.Doc} svg 
   * @param {Base} b1 
   * @param {Base} b2 
   * 
   * @returns {StrandBond} 
   */
  static create(svg, b1, b2) {
    let cs = StraightBond.coordinates(b1, b2, 8, 8);
    let line = svg.line(cs.x1, cs.y1, cs.x2, cs.y2);
    line.id(createUUIDforSVG());
    let sb = new StrandBond(line, b1, b2);
    StrandBond._applyMostRecentProps(sb);
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
    StrandBond._mostRecentProps.padding1 = p;
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
    StrandBond._mostRecentProps.padding2 = p;
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
    StrandBond._mostRecentProps.stroke = this.s;
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
    StrandBond._mostRecentProps.strokeWidth = sw;
  }

  /**
   * @returns {StraightBond~SavableState} 
   */
  savableState() {
    return {
      className: 'StrandBond',
      line: this._line.id(),
      base1: this.base1.id,
      base2: this.base2.id,
    };
  }
}

StrandBond._mostRecentProps = {
  padding1: 6,
  padding2: 6,
  stroke: '#808080',
  strokeWidth: 1,
};

class WatsonCrickBond extends StraightBond {

  /**
   * @typedef {Object} WatsonCrickBond~MostRecentProps 
   * @property {number} padding1 
   * @property {number} padding2 
   * @property {string} autStroke 
   * @property {string} gcStroke 
   * @property {string} gutStroke 
   * @property {number} strokeWidth 
   */

  /**
   * @returns {WatsonCrickBond~MostRecentProps} 
   */
  static mostRecentProps() {
    return { ...WatsonCrickBond._mostRecentProps };
  }

  /**
   * @param {WatsonCrickBond} wcb 
   */
  static _applyMostRecentProps(wcb) {
    let mrps = WatsonCrickBond.mostRecentProps();

    wcb.padding1 = mrps.padding1;
    wcb.padding2 = mrps.padding2;
    wcb.strokeWidth = mrps.strokeWidth;

    if (wcb.isAUT()) {
      wcb.stroke = mrps.autStroke;
    } else if (wcb.isGC()) {
      wcb.stroke = mrps.gcStroke;
    } else if (wcb.isGUT()) {
      wcb.stroke = mrps.gutStroke;
    } else {
      wcb.stroke = mrps.otherStroke;
    }
  }

  /**
   * @param {WatsonCrickBond} wcb 
   */
  static _copyPropsToMostRecent(wcb) {
    WatsonCrickBond._mostRecentProps.padding1 = wcb.padding1;
    WatsonCrickBond._mostRecentProps.padding2 = wcb.padding2;
    WatsonCrickBond._mostRecentProps.strokeWidth = wcb.strokeWidth;
    
    if (wcb.isAUT()) {
      WatsonCrickBond._mostRecentProps.autStroke = wcb.stroke;
    } else if (wcb.isGC()) {
      WatsonCrickBond._mostRecentProps.gcStroke = wcb.stroke;
    } else if (wcb.isGUT()) {
      WatsonCrickBond._mostRecentProps.gutStroke = wcb.stroke;
    } else {
      WatsonCrickBond._mostRecentProps.otherStroke = wcb.stroke;
    }
  }

  /**
   * @param {StraightBond~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * @param {StraightBond~getBaseById} getBaseById 
   * 
   * @throws {Error} If the saved state is not for a Watson-Crick bond.
   */
  static fromSavedState(savedState, svg, getBaseById) {
    if (savedState.className !== 'WatsonCrickBond') {
      throw new Error('Saved state is not for a Watson-Crick bond.');
    }

    let line = svg.findOne('#' + savedState.line);
    let b1 = getBaseById(savedState.base1);
    let b2 = getBaseById(savedState.base2);
    let wcb = new WatsonCrickBond(line, b1, b2);

    WatsonCrickBond._copyPropsToMostRecent(wcb);
    return wcb;
  }

  /**
   * @param {SVG.Doc} svg 
   * @param {Base} b1 
   * @param {Base} b2 
   * 
   * @returns {WatsonCrickBond} 
   */
  static create(svg, b1, b2) {
    let cs = StraightBond.coordinates(b1, b2, 8, 8);
    let line = svg.line(cs.x1, cs.y1, cs.x2, cs.y2);
    line.id(createUUIDforSVG());
    let wcb = new WatsonCrickBond(line, b1, b2);
    WatsonCrickBond._applyMostRecentProps(wcb);
    return wcb;
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
    WatsonCrickBond._mostRecentProps.padding1 = p;
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
    WatsonCrickBond._mostRecentProps.padding2 = p;
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
      WatsonCrickBond._mostRecentProps.autStroke = s;
    } else if (this.isGC()) {
      WatsonCrickBond._mostRecentProps.gcStroke = s;
    } else if (this.isGUT()) {
      WatsonCrickBond._mostRecentProps.gutStroke = s;
    } else {
      WatsonCrickBond._mostRecentProps.otherStroke = s;
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
    WatsonCrickBond._mostRecentProps.strokeWidth = sw;
  }

  /**
   * @returns {StraightBond~SavableState} 
   */
  savableState() {
    return {
      className: 'WatsonCrickBond',
      line: this._line.id(),
      base1: this.base1.id,
      base2: this.base2.id,
    };
  }
}

WatsonCrickBond._mostRecentProps = {
  padding: 6,
  autStroke: '#000000',
  gcStroke: '#000000',
  gutStroke: '#808080',
  otherStroke: '#808080',
  strokeWidth: 2,
};

export {
  StraightBond,
  StrandBond,
  WatsonCrickBond,
};
