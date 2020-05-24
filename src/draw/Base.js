import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import { CircleBaseAnnotation } from './BaseAnnotation';
import BaseNumbering from './BaseNumbering';

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
   * Returns null if the saved state is invalid.
   * 
   * @param {Base~SavableState} savedState 
   * @param {SVG.Svg} svg 
   * 
   * @returns {Base|null} 
   */
  static fromSavedState(savedState, svg) {
    if (savedState.className !== 'Base') {
      return null;
    }
    let text = svg.findOne('#' + savedState.textId);
    let b = null;
    try {
      b = new Base(text);
    } catch (err) {
      return null;
    }
    if (savedState.highlighting) {
      b.addCircleHighlightingFromSavedState(savedState.highlighting);
    }
    if (savedState.outline) {
      b.addCircleOutlineFromSavedState(savedState.outline);
    }
    if (savedState.numbering) {
      b.addNumberingFromSavedState(savedState.numbering);
    }
    Base._copyPropsToMostRecent(b);
    return b;
  }

  /**
   * @param {Base~SavableState} savedState 
   * @param {SVG.Svg} svg 
   * 
   * @returns {number} 
   */
  static xFromSavedState(savedState, svg) {
    let text = svg.findOne('#' + savedState.textId);
    return text.attr('x');
  }

  /**
   * @param {Base~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * 
   * @returns {number} 
   */
  static yFromSavedState(savedState, svg) {
    let text = svg.findOne('#' + savedState.textId);
    return text.attr('y');
  }

  /**
   * Returns null if the given string is not a single character.
   * 
   * @param {SVG.Svg} svg 
   * @param {string} character 
   * @param {number} xCenter 
   * @param {number} yCenter 
   * 
   * @returns {Base|null} 
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
    let b = null;
    try {
      b = new Base(text);
    } catch (err) {
      return null;
    }
    Base._applyMostRecentProps(b);
    return b;
  }

  /**
   * Returns null if the given string is not a single character.
   * 
   * @param {SVG.Doc} svg 
   * @param {string} character 
   * 
   * @returns {Base|null} 
   */
  static createOutOfView(svg, character) {
    return Base.create(svg, character, 0, -200);
  }

  /**
   * @param {SVG.Text} text 
   * 
   * @throws {Error} If the text content is not a single character.
   */
  constructor(text) {
    this._text = text;
    this._validateText();
    
    this._highlighting = null;
    this._outline = null;
    this._numbering = null;
  }

  /**
   * Initializes the ID of the text if it is not already initialized.
   * 
   * Sets the text-anchor and dominant-baseline attributes to middle
   * without changing where the text is displayed.
   * 
   * @throws {Error} If the text content is not a single character.
   */
  _validateText() {
    this._text.id();
    if (this._text.text().length !== 1) {
      throw new Error('The text content must be a single character.');
    }
    let b = this._text.bbox();
    let cxPrev = b.cx;
    let cyPrev = b.cy;
    this._text.attr({ 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
    b = this._text.bbox();
    let x = this._text.attr('x') - (b.cx - cxPrev);
    let y = this._text.attr('y') - (b.cy - cyPrev);
    this._text.attr({ 'x': x, 'y': y });
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
   * Has no effect if the given string is not a single character.
   * 
   * @param {string} c 
   */
  set character(c) {
    if (c.length !== 1) {
      return;
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
   */
  moveTo(xCenter, yCenter) {
    this._text.attr({
      'x': xCenter,
      'y': yCenter
    });
    if (this.hasHighlighting()) {
      this._highlighting.reposition(xCenter, yCenter);
    }
    if (this.hasOutline()) {
      this._outline.reposition(xCenter, yCenter);
    }
    if (this.hasNumbering()) {
      this._numbering.reposition(xCenter, yCenter);
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
   * @param {function} callback 
   */
  bindMouseover(callback) {
    this._text.mouseover(callback);
  }

  onMouseover(cb) {
    this._text.mouseover(cb);
  }

  /**
   * @param {function} callback 
   */
  bindMouseout(callback) {
    this._text.mouseout(callback);
  }

  onMouseout(cb) {
    this._text.mouseout(cb);
  }

  /**
   * @param {function} callback 
   */
  bindMousedown(callback) {
    this._text.mousedown(callback);
  }

  onMousedown(cb) {
    this._text.mousedown(cb);
  }

  /**
   * @param {function} callback 
   */
  bindDblclick(callback) {
    this._text.dblclick(callback);
  }

  /**
   * @returns {CircleBaseAnnotation} 
   */
  addCircleHighlighting() {
    this.removeHighlighting();
    this._highlighting = CircleBaseAnnotation.createNondisplaced(
      this._text.root(),
      this.xCenter,
      this.yCenter,
    );
    this._highlighting.insertBefore(this._text);
    return this._highlighting;
  }

  /**
   * @param {CircleBaseAnnotation~SavableState} savedState 
   * 
   * @returns {CircleBaseAnnotation} 
   */
  addCircleHighlightingFromSavedState(savedState) {
    this.removeHighlighting();
    this._highlighting = CircleBaseAnnotation.fromSavedState(
      savedState,
      this._text.root(),
      this.xCenter,
      this.yCenter,
    );
    this._highlighting.insertBefore(this._text);
    return this._highlighting;
  }

  /**
   * @returns {boolean} 
   */
  hasHighlighting() {
    if (this._highlighting) {
      return true;
    }
    return false;
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
   * @returns {CircleBaseAnnotation} 
   */
  addCircleOutline() {
    this.removeOutline();
    this._outline = CircleBaseAnnotation.createNondisplaced(
      this._text.root(),
      this.xCenter,
      this.yCenter,
    );
    return this._outline;
  }

  /**
   * @param {CircleBaseAnnotation~SavableState} savedState 
   * 
   * @returns {CircleBaseAnnotation} 
   */
  addCircleOutlineFromSavedState(savedState) {
    this.removeOutline();
    this._outline = CircleBaseAnnotation.fromSavedState(
      savedState,
      this._text.root(),
      this.xCenter,
      this.yCenter,
    );
    return this._outline;
  }

  /**
   * @returns {boolean} 
   */
  hasOutline() {
    if (this._outline) {
      return true;
    }
    return false;
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
   * Returns null if the given number is not accepted by the BaseNumbering class.
   * 
   * @param {number} number 
   * 
   * @returns {BaseNumbering|null} 
   */
  addNumbering(number) {
    this.removeNumbering();
    this._numbering = BaseNumbering.create(
      this._text.root(),
      number,
      this.xCenter,
      this.yCenter,
    );
    return this._numbering;
  }

  /**
   * @param {BaseNumbering~SavableState} savedState 
   * 
   * @returns {BaseNumbering} 
   */
  addNumberingFromSavedState(savedState) {
    this.removeNumbering();
    this._numbering = BaseNumbering.fromSavedState(
      savedState,
      this._text.root(),
      this.xCenter,
      this.yCenter,
    );
    return this._numbering;
  }

  /**
   * @returns {boolean} 
   */
  hasNumbering() {
    if (this._numbering) {
      return true;
    }
    return false;
  }

  /**
   * @returns {BaseNumbering|null} 
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
   * @property {string} textId 
   * @property {CircleBaseAnnotation~SavableState|undefined} highlighting 
   * @property {CircleBaseAnnotation~SavableState|undefined} outline 
   * @property {BaseNumbering~SavableState|undefined} numbering 
   */

  /**
   * @returns {Base~SavableState} 
   */
  savableState() {
    let savableState = {
      className: 'Base',
      textId: this._text.id(),
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

  refreshIds() {
    this._text.id(null);
    this._text.id();
    if (this.hasHighlighting()) {
      this.highlighting.refreshIds();
    }
    if (this.hasOutline()) {
      this.outline.refreshIds();
    }
    if (this.hasNumbering()) {
      this.numbering.refreshIds();
    }
  }
}

Base._mostRecentProps = {
  fontFamily: 'Arial',
  fontSize: 9,
  fontWeight: 'bold',
  fontStyle: 'normal',
};

export default Base;
