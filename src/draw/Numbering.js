import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';
import createUUIDforSVG from './createUUIDforSVG';

class Numbering {

  /**
   * @param {Numbering~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * @param {number} xCenterBase 
   * @param {number} yCenterBase 
   * 
   * @throws {Error} If the saved state is not for a numbering.
   */
  static fromSavedState(savedState, svg, xCenterBase, yCenterBase) {
    if (savedState.className !== 'Numbering') {
      throw new Error('Saved state is not for a numbering.');
    }

    let text = svg.findOne('#' + savedState.text);
    let line = svg.findOne('#' + savedState.line);
    return new Numbering(text, line, xCenterBase, yCenterBase);
  }

  /**
   * @typedef {Object} Numbering~LineCoordinates 
   * @property {number} x1 
   * @property {number} y1 
   * @property {number} x2 
   * @property {number} y2 
   */

  /**
   * @param {number} xCenterBase 
   * @param {number} yCenterBase 
   * @param {number} angle 
   * @param {number} basePadding 
   * @param {number} length 
   * 
   * @returns {Numbering~LineCoordinates} 
   */
  static _lineCoordinates(xCenterBase, yCenterBase, angle, basePadding, length) {
    let x1 = xCenterBase + (basePadding * Math.cos(angle));
    let y1 = yCenterBase + (basePadding * Math.sin(angle));

    let x2 = x1 + (length * Math.cos(angle));
    let y2 = y1 + (length * Math.sin(angle));

    return { x1: x1, y1: y1, x2: x2, y2: y2 };
  }

  /**
   * @typedef {Object} Numbering~TextPositioning 
   * @property {number} x 
   * @property {number} y 
   * @property {string} textAnchor 
   * @property {string} dy 
   */

  /**
   * @param {SVG.Line} line 
   * 
   * @returns {Numbering~TextPositioning} 
   */
  static _textPositioning(line) {
    let lineAngle = angleBetween(
      line.attr('x1'),
      line.attr('y1'),
      line.attr('x2'),
      line.attr('y2'),
    );

    lineAngle = normalizeAngle(lineAngle, 0);
    let tp = {};
    let textPadding = 4;

    if (lineAngle < Math.PI / 4 || lineAngle > 7 * Math.PI / 4) {
      tp.x = line.attr('x2') + textPadding;
      tp.y = line.attr('y2');
      tp.textAnchor = 'start';
      tp.dy = '0.4em';
    } else if (lineAngle >= Math.PI / 4 && lineAngle < 3 * Math.PI / 4) {
      tp.x = line.attr('x2');
      tp.y = line.attr('y2') + textPadding;
      tp.textAnchor = 'middle';
      tp.dy = '0.8em';
    } else if (lineAngle >= 3 * Math.PI / 4 && lineAngle < 5 * Math.PI / 4) {
      tp.x = line.attr('x2') - textPadding;
      tp.y = line.attr('y2');
      tp.textAnchor = 'end';
      tp.dy = '0.4em';
    } else {
      tp.x = line.attr('x2');
      tp.y = line.attr('y2') - textPadding;
      tp.textAnchor = 'middle';
      tp.dy = '0em';
    }

    return tp;
  }

  /**
   * @param {SVG.Doc} svg 
   * @param {number} number 
   * @param {number} xCenterBase 
   * @param {number} yCenterBase 
   * @param {number} angle 
   * 
   * @returns {Numbering} 
   */
  static create(svg, number, xCenterBase, yCenterBase, angle) {
    let lc = Numbering._lineCoordinates(xCenterBase, yCenterBase, angle, 10, 8);
    let line = svg.line(lc.x1, lc.y1, lc.x2, lc.y2);
    line.id(createUUIDforSVG());
    
    let text = svg.text((add) => add.tspan(number.toString()));
    text.id(createUUIDforSVG());
    let tp = Numbering._textPositioning(line);

    text.attr({
      'x': tp.x,
      'y': tp.y,
      'text-anchor': tp.textAnchor,
      'dy': tp.dy,
    });
    
    return new Numbering(text, line, xCenterBase, yCenterBase);
  }

  /**
   * @param {SVG.Text} text 
   * @param {SVG.Line} line 
   * @param {number} xCenterBase 
   * @param {number} yCenterBase 
   */
  constructor(text, line, xCenterBase, yCenterBase) {
    this._text = text;
    this._validateText();

    this._line = line;
    this._validateLine();
    this._storeBasePadding(xCenterBase, yCenterBase);

    this.applyDefaults();
  }

  /**
   * @throws {Error} If the ID of the text is not a string or is an empty string.
   * @throws {Error} If the text cannot be parsed as an integer.
   */
  _validateText() {
    if (typeof(this._text.id()) !== 'string' || this._text.id().length === 0) {
      throw new Error('Invalid text ID.');
    }

    let n = Number.parseFloat(this._text.text());

    if (!isFinite(n) || Math.floor(n) !== n) {
      throw new Error('Text cannot be parsed as an integer.');
    }
  }

  /**
   * @returns {string} 
   */
  get id() {
    return this._text.id();
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
   * Sets the _basePadding property.
   * 
   * @param {number} xCenterBase 
   * @param {number} yCenterBase 
   */
  _storeBasePadding(xCenterBase, yCenterBase) {
    this._basePadding = distanceBetween(
      xCenterBase,
      yCenterBase,
      this._line.attr('x1'),
      this._line.attr('y1'),
    );
  }

  /**
   * @returns {number} 
   */
  get basePadding() {
    return this._basePadding;
  }

  /**
   * @param {number} bp 
   */
  set basePadding(bp) {
    let angle = angleBetween(
      this._line.attr('x1'),
      this._line.attr('y1'),
      this._line.attr('x2'),
      this._line.attr('y2'),
    );

    let xCenterBase = this._line.attr('x1') - (this.basePadding * Math.cos(angle));
    let yCenterBase = this._line.attr('y1') - (this.basePadding * Math.sin(angle));

    this._reposition(
      xCenterBase,
      yCenterBase,
      angle,
      bp,
      this.lineLength,
    );
  }

  /**
   * @returns {number} 
   */
  get lineLength() {
    return distanceBetween(
      this._line.attr('x1'),
      this._line.attr('y1'),
      this._line.attr('x2'),
      this._line.attr('y2'),
    );
  }

  /**
   * @param {number} ll 
   */
  set lineLength(ll) {
    let angle = angleBetween(
      this._line.attr('x1'),
      this._line.attr('y1'),
      this._line.attr('x2'),
      this._line.attr('y2'),
    );

    let xCenterBase = this._line.attr('x1') - (this.basePadding * Math.cos(angle));
    let yCenterBase = this._line.attr('y1') - (this.basePadding * Math.sin(angle));

    this._reposition(
      xCenterBase,
      yCenterBase,
      angle,
      this.basePadding,
      ll,
    );
  }

  /**
   * Repositions this numbering based on the given base coordinates and angle,
   * maintaining the previous base padding and line length.
   * 
   * @param {number} xCenterBase 
   * @param {number} yCenterBase 
   * @param {number} angle 
   */
  reposition(xCenterBase, yCenterBase, angle) {
    this._reposition(
      xCenterBase,
      yCenterBase,
      angle,
      this.basePadding,
      this.lineLength,
    );
  }

  /**
   * Repositions this numbering based on the given base coordinates, angle, base padding,
   * and line length.
   * 
   * @param {number} xCenterBase 
   * @param {number} yCenterBase 
   * @param {number} angle 
   * @param {number} basePadding 
   * @param {number} lineLength 
   */
  _reposition(xCenterBase, yCenterBase, angle, basePadding, lineLength) {
    let lc = Numbering._lineCoordinates(
      xCenterBase,
      yCenterBase,
      angle,
      basePadding,
      lineLength,
    );

    this._line.attr({ 'x1': lc.x1, 'y1': lc.y1, 'x2': lc.x2, 'y2': lc.y2 });

    let tp = Numbering._textPositioning(this._line);

    this._text.attr({
      'x': tp.x,
      'y': tp.y,
      'text-anchor': tp.textAnchor,
      'dy': tp.dy,
    });

    this._storeBasePadding(xCenterBase, yCenterBase);
  }

  /**
   * @param {SVG.Element} ele 
   */
  insertBefore(ele) {
    this._text.insertBefore(ele);
    this._line.insertBefore(ele);
  }

  /**
   * @param {SVG.Element} ele 
   */
  insertAfter(ele) {
    this._text.insertAfter(ele);
    this._line.insertAfter(ele);
  }

  /**
   * @returns {number} 
   */
  get number() {
    return Number.parseInt(this._text.text());
  }

  /**
   * @param {number} n 
   * 
   * @throws {Error} If the given number is not an integer.
   */
  set number(n) {
    if (!isFinite(n) || Math.floor(n) !== n) {
      throw new Error('Number must be an integer.');
    }

    this._text.clear();
    this._text.tspan(n.toString());
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
  }

  /**
   * @returns {number} 
   */
  get fontSize() {
    return this._text.attr('font-size');
  }

  /**
   * @param {number} fs 
   */
  set fontSize(fs) {
    this._text.attr({ 'font-size': fs });
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
  }

  /**
   * @returns {string} 
   */
  get color() {
    return this._text.attr('fill');
  }

  /**
   * @param {string} c 
   */
  set color(c) {
    this._text.attr({ 'fill': c });
    this._line.attr({ 'stroke': c });
  }

  /**
   * @returns {number} 
   */
  get lineStrokeWidth() {
    return this._line.attr('stroke-width');
  }

  /**
   * @param {number} lsw 
   */
  set lineStrokeWidth(lsw) {
    this._line.attr({ 'stroke-width': lsw });
  }

  applyDefaults() {
    this.basePadding = Numbering.defaults.basePadding;
    this.lineLength = Numbering.defaults.lineLength;
    this.fontFamily = Numbering.defaults.fontFamily;
    this.fontSize = Numbering.defaults.fontSize;
    this.fontWeight = Numbering.defaults.fontWeight;
    this.color = Numbering.defaults.color;
    this.lineStrokeWidth = Numbering.defaults.lineStrokeWidth;
  }

  remove() {
    this._text.remove();
    this._line.remove();
  }

  /**
   * @typedef {Object} Numbering~SavableState 
   * @property {string} className 
   * @property {string} text 
   * @property {string} line 
   */

  /**
   * @returns {Numbering~SavableState} 
   */
  savableState() {
    return {
      className: 'Numbering',
      text: this._text.id(),
      line: this._line.id(),
    };
  }
}

Numbering.defaults = {
  basePadding: 12,
  lineLength: 8,
  fontFamily: 'Arial',
  fontSize: 7,
  fontWeight: 'normal',
  color: '#808080',
  lineStrokeWidth: 1,
};

export default Numbering;
