import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import { CircleBaseAnnotation } from './BaseAnnotation';
import Numbering from './Numbering';

class Base {

  /**
   * @typedef {Object} Base~MostRecentProps 
   * @property {string} fontFamily 
   * @property {number} fontSize 
   * @property {string|number} fontWeight 
   * @property {string} fontStyle 
   */

  /**
   * @returns {Base~MostRecentProps} 
   */
  static mostRecentProps() {
    return { ...Base._mostRecentProps };
  }

  /**
   * @param {Base} b 
   */
  static _applyMostRecentProps(b) {
    let props = Base.mostRecentProps();
    b.fontFamily = props.fontFamily;
    b.fontSize = props.fontSize;
    b.fontWeight = props.fontWeight;
    b.fontStyle = props.fontStyle;
  }

  /**
   * @param {Base} b 
   */
  static _copyPropsToMostRecent(b) {
    Base._mostRecentProps.fontFamily = b.fontFamily;
    Base._mostRecentProps.fontSize = b.fontSize;
    Base._mostRecentProps.fontWeight = b.fontWeight;
    Base._mostRecentProps.fontStyle = b.fontStyle;
  }

  /**
   * @param {Base~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * @param {number} clockwiseNormalAngle 
   * 
   * @throws {Error} If the saved state is not for a base.
   */
  static fromSavedState(savedState, svg, clockwiseNormalAngle) {
    if (savedState.className !== 'Base') {
      throw new Error('Saved state is not for a base.');
    }

    let text = svg.findOne('#' + savedState.text);
    let b = new Base(text);

    if (savedState.highlighting) {
      b.addCircleHighlightingFromSavedState(savedState.highlighting, svg, clockwiseNormalAngle);
    }

    if (savedState.outline) {
      b.addCircleOutlineFromSavedState(savedState.outline, svg, clockwiseNormalAngle);
    }

    if (savedState.numbering) {
      b.addNumberingFromSavedState(savedState.numbering, svg);
    }

    Base._copyPropsToMostRecent(b);
    return b;
  }

  /**
   * @param {Base~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * 
   * @returns {number} 
   */
  static xCenterFromSavedState(savedState, svg) {
    let text = svg.findOne('#' + savedState.text);
    return text.attr('x');
  }

  /**
   * @param {Base~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * 
   * @returns {number} 
   */
  static yCenterFromSavedState(savedState, svg) {
    let text = svg.findOne('#' + savedState.text);
    return text.attr('y');
  }

  /**
   * @param {SVG.Doc} svg 
   * @param {string} character 
   * @param {number} xCenter 
   * @param {number} yCenter 
   * 
   * @returns {Base} 
   */
  static create(svg, character, xCenter, yCenter) {
    let text = svg.text((add) => add.tspan(character));
    text.id();

    text.attr({
      'x': xCenter,
      'y': yCenter,
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
    });

    let b = new Base(text);
    Base._applyMostRecentProps(b);
    return b;
  }

  /**
   * @param {SVG.Doc} svg 
   * @param {string} character 
   */
  static createOutOfView(svg, character) {
    return Base.create(svg, character, 0, -200);
  }

  /**
   * @param {SVG.Text} text 
   */
  constructor(text) {
    this._text = text;
    this._validateText();
    
    this._highlighting = null;
    this._outline = null;
    this._numbering = null;
  }

  /**
   * @throws {Error} If the ID of the text is not a string or is an empty string.
   * @throws {Error} If the text content is not a single character.
   * @throws {Error} If the text-anchor property is not middle.
   * @throws {Error} If the dy property is not 0.4em.
   */
  _validateText() {

    if (typeof(this._text.id()) !== 'string' || this._text.id().length === 0) {
      throw new Error('Invalid ID.');
    }

    if (this._text.text().length !== 1) {
      throw new Error('The text content must be a single character.');
    }

    if (this._text.attr('text-anchor') !== 'middle') {
      throw new Error('The text-anchor property must be middle.');
    }

    if (this._text.attr('dominant-baseline') !== 'middle') {
      throw new Error('dominant-baseline must be middle.');
    }
  }

  /**
   * @returns {string} 
   */
  get id() {
    return this._text.id();
  }

  /**
   * @returns {string} 
   */
  get character() {
    return this._text.text();
  }

  /**
   * @param {string} c 
   * 
   * @throws {Error} If the length of the given string is not one.
   */
  set character(c) {
    if (c.length !== 1) {
      throw new Error('The given string has multiple characters.');
    }

    this._text.clear();
    this._text.tspan(c);
  }

  /**
   * @returns {number} 
   */
  get xCenter() {
    return this._text.attr('x');
  }

  /**
   * @returns {number} 
   */
  get yCenter() {
    return this._text.attr('y');
  }

  /**
   * @param {number} xCenter 
   * @param {number} yCenter 
   * @param {number} clockwiseNormalAngle 
   * @param {number} outerNormalAngle 
   */
  move(xCenter, yCenter, clockwiseNormalAngle, outerNormalAngle) {
    this._text.attr({
      'x': xCenter,
      'y': yCenter
    });

    if (this._highlighting !== null) {
      this._highlighting.reposition(xCenter, yCenter, clockwiseNormalAngle);
    }

    if (this._outline !== null) {
      this._outline.reposition(xCenter, yCenter, clockwiseNormalAngle);
    }

    if (this._numbering !== null) {
      this._numbering.reposition(xCenter, yCenter, outerNormalAngle);
    }
  }

  /**
   * @param {Base} other 
   * 
   * @returns {number} 
   */
  distanceBetweenCenters(other) {
    return distanceBetween(
      this.xCenter,
      this.yCenter,
      other.xCenter,
      other.yCenter
    );
  }

  /**
   * @param {Base} other 
   * 
   * @returns {number} 
   */
  angleBetweenCenters(other) {
    return angleBetween(
      this.xCenter,
      this.yCenter,
      other.xCenter,
      other.yCenter
    );
  }

  /**
   * @returns {string} 
   */
  get fontFamily() {
    return this._text.attr('font-family');
  }

  /**
   * @param {string} ff 
   */
  set fontFamily(ff) {
    this._text.attr({ 'font-family': ff });
    Base._mostRecentProps.fontFamily = ff;
  }

  /**
   * @returns {number} 
   */
  get fontSize() {
    return this._text.attr('font-size');
  }

  /**]
   * @param {number} fs 
   */
  set fontSize(fs) {
    this._text.attr({ 'font-size': fs });
    Base._mostRecentProps.fontSize = fs;
  }

  /**
   * @returns {string|number} 
   */
  get fontWeight() {
    return this._text.attr('font-weight');
  }

  /**
   * @param {string|number} fw 
   */
  set fontWeight(fw) {
    this._text.attr({ 'font-weight': fw });
    Base._mostRecentProps.fontWeight = fw;
  }

  /**
   * @returns {string} 
   */
  get fontStyle() {
    return this._text.attr('font-style');
  }

  /**
   * @param {string} fs 
   */
  set fontStyle(fs) {
    this._text.attr({ 'font-style': fs });
    Base._mostRecentProps.fontStyle = fs;
  }

  /**
   * @returns {string} 
   */
  get fill() {
    return this._text.attr('fill');
  }

  /**
   * @param {string} f 
   */
  set fill(f) {
    this._text.attr({ 'fill': f });
  }

  /**
   * @param {function} callback 
   */
  bindMouseover(callback) {
    this._text.mouseover(callback);
  }

  /**
   * @param {function} callback 
   */
  bindMouseout(callback) {
    this._text.mouseout(callback);
  }

  /**
   * @param {function} callback 
   */
  bindMousedown(callback) {
    this._text.mousedown(callback);
  }

  /**
   * @param {function} callback 
   */
  bindDblclick(callback) {
    this._text.dblclick(callback);
  }

  /**
   * @returns {string} 
   */
  get cursor() {
    return this._text.css('cursor');
  }

  /**
   * @param {string} c 
   */
  set cursor(c) {
    this._text.css({ 'cursor': c });
  }

  /**
   * @param {SVG.Doc} svg 
   * 
   * @returns {CircleBaseAnnotation} 
   */
  addCircleHighlighting(svg) {
    this.removeHighlighting();

    this._highlighting = CircleBaseAnnotation.createNondisplaced(
      svg, this.xCenter, this.yCenter
    );

    return this._highlighting;
  }

  /**
   * @param {CircleBaseAnnotation~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * @param {number} clockwiseNormalAngle 
   * 
   * @returns {CircleBaseAnnotation} 
   */
  addCircleHighlightingFromSavedState(savedState, svg, clockwiseNormalAngle) {
    this.removeHighlighting();

    this._highlighting = CircleBaseAnnotation.fromSavedState(
      savedState,
      svg,
      this.xCenter,
      this.yCenter,
      clockwiseNormalAngle,
    );

    return this._highlighting;
  }

  /**
   * @returns {boolean} 
   */
  hasHighlighting() {
    return this._highlighting !== null;
  }

  /**
   * @returns {CircleBaseAnnotation|null} 
   */
  get highlighting() {
    return this._highlighting;
  }

  /**
   * Has no effect if this base has no highlighting.
   */
  removeHighlighting() {
    if (this.hasHighlighting()) {
      this._highlighting.remove();
      this._highlighting = null;
    }
  }

  /**
   * @param {SVG.Doc} svg 
   * 
   * @returns {CircleBaseAnnotation} 
   */
  addCircleOutline(svg) {
    this.removeOutline();

    this._outline = CircleBaseAnnotation.createNondisplaced(
      svg, this.xCenter, this.yCenter
    );

    return this._outline;
  }

  /**
   * @param {CircleBaseAnnotation~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * @param {number} clockwiseNormalAngle 
   * 
   * @returns {CircleBaseAnnotation} 
   */
  addCircleOutlineFromSavedState(savedState, svg, clockwiseNormalAngle) {
    this.removeOutline();

    this._outline = CircleBaseAnnotation.fromSavedState(
      savedState,
      svg,
      this.xCenter,
      this.yCenter,
      clockwiseNormalAngle,
    );

    return this._outline;
  }

  /**
   * @returns {boolean} 
   */
  hasOutline() {
    return this._outline !== null;
  }

  /**
   * @returns {CircleBaseAnnotation|null} 
   */
  get outline() {
    return this._outline;
  }

  /**
   * Has no effect if this base has no outline.
   */
  removeOutline() {
    if (this.hasOutline()) {
      this._outline.remove();
      this._outline = null;
    }
  }

  /**
   * @param {SVG.Doc} svg 
   * @param {number} number 
   * @param {number} outerNormalAngle 
   * 
   * @returns {Numbering} 
   */
  addNumbering(svg, number, outerNormalAngle) {
    this.removeNumbering();

    this._numbering = Numbering.create(
      svg, number, this.xCenter, this.yCenter, outerNormalAngle
    );

    return this._numbering;
  }

  /**
   * @param {Numbering~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * 
   * @returns {Numbering} 
   */
  addNumberingFromSavedState(savedState, svg) {
    this.removeNumbering();

    this._numbering = Numbering.fromSavedState(
      savedState,
      svg,
      this.xCenter,
      this.yCenter,
    );

    return this._numbering;
  }

  /**
   * @returns {boolean} 
   */
  hasNumbering() {
    return this._numbering !== null;
  }

  /**
   * @returns {Numbering|null} 
   */
  get numbering() {
    return this._numbering;
  }

  /**
   * Has no effect if this base has no numbering.
   */
  removeNumbering() {
    if (this.hasNumbering()) {
      this._numbering.remove();
      this._numbering = null;
    }
  }

  remove() {
    this.removeHighlighting();
    this.removeOutline();
    this.removeNumbering();
    
    this._text.remove();
  }

  /**
   * @typedef {Object} Base~SavableState 
   * @property {string} className 
   * @property {string} text 
   * @property {CircleBaseAnnotation~SavableState|undefined} highlighting 
   * @property {CircleBaseAnnotation~SavableState|undefined} outline 
   * @property {Numbering~SavableState|undefined} numbering 
   */

  /**
   * @returns {Base~SavableState} 
   */
  savableState() {
    let savableState = {
      className: 'Base',
      text: this._text.id(),
    };

    if (this.hasHighlighting()) {
      savableState.highlighting = this._highlighting.savableState();
    }

    if (this.hasOutline()) {
      savableState.outline = this._outline.savableState();
    }

    if (this.hasNumbering()) {
      savableState.numbering = this._numbering.savableState();
    }

    return savableState;
  }
}

Base._mostRecentProps = {
  fontFamily: 'Arial',
  fontSize: 9,
  fontWeight: 'bold',
  fontStyle: 'normal',
};

export default Base;
