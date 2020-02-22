import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';
import createUUIDforSVG from './createUUIDforSVG';

class Numbering {

  /**
   * @typedef {Object} Numbering~LineCoordinates 
   * @property {number} x1 
   * @property {number} y1 
   * @property {number} x2 
   * @property {number} y2 
   */

  /**
   * @param {number} xCenterBase The X coordinate of the center of the base the numbering belongs to.
   * @param {number} yCenterBase The Y coordinate of the center of the base the numbering belongs to.
   * @param {number} angle The angle at which the line should emanate from the base.
   * @param {number} basePadding The padding between the line and the center of the base.
   * @param {number} length How long the line should be.
   * 
   * @returns {Numbering~LineCoordinates} The coordinates for the line.
   */
  _lineCoordinates(xCenterBase, yCenterBase, angle, basePadding, length) {
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
   * @param {SVG.Line} line The line of the numbering.
   * 
   * @returns {Numbering~TextPositioning} The positioning of the text of the numbering.
   */
  _textPositioning(line) {
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
      tp.y = line.attr('y2') - textPadding;
      tp.textAnchor = 'middle';
      tp.dy = '0.8em';
    } else if (lineAngle >= 3 * Math.PI / 4 && lineAngle < 5 * Math.PI / 4) {
      tp.x = line.attr('x2') - textPadding;
      tp.y = line.attr('y2');
      tp.textAnchor = 'end';
      tp.dy = '0.4em';
    } else {
      tp.x = line.attr('x2');
      tp.y = line.attr('y2') + textPadding;
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
  create(svg, number, xCenterBase, yCenterBase, angle) {
    let lc = this._lineCoordinates(xCenterBase, yCenterBase, angle, 8);
    let line = svg.line(lc.x1, lc.y1, lc.x2, lc.y2);
    line.id(createUUIDforSVG());
    
    let text = svg.text((add) => add.tspan(number));
    text.id(createUUIDforSVG());
    let tp = this._textPositioning(line);

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
  }

  /**
   * @throws {Error} If the ID of the text is not a string or is an empty string.
   * @throws {Error} If the text cannot be parsed as an integer.
   */
  _validateText() {
    if (typeof(this._text.id()) !== 'string' || this._text.id().length === 0) {
      throw new Error('Invalid text ID.');
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
   * @param {number} bp The new base padding.
   * @param {number} xCenterBase 
   * @param {number} yCenterBase 
   * @param {number} angle 
   */
  setBasePadding(bp, xCenterBase, yCenterBase, angle) {
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
   * @param {number} ll The new line length.
   * @param {number} xCenterBase 
   * @param {number} yCenterBase 
   * @param {number} angle 
   */
  setLineLength(ll, xCenterBase, yCenterBase, angle) {
    this._reposition(
      xCenterBase,
      yCenterBase,
      angle,
      this.basePadding,
      ll,
    );
  }

  /**
   * Repositions this numbering based on the provided base coordinates and angle,
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
   * Repositions this numbering based on the provided parameters.
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
      lineLength
    );

    this._line.attr({ 'x1': lc.x1, 'y1': lc.y1, 'x2': lc.x1, 'y2': lc.x2 });

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
   * Inserts the text and line of this numbering before the given element.
   * 
   * @param {SVG.Element} ele 
   */
  insertBefore(ele) {
    this._text.insertBefore(ele);
    this._line.insertBefore(ele);
  }

  /**
   * Inserts the text and line of this numbering after the given element.
   * 
   * @param {SVG.Element} ele 
   */
  insertAfter(ele) {
    this._text.insertAfter(ele);
    this._line.insertAfter(ele);
  }

  /**
   * @returns {number} The integer that this numbering shows.
   */
  get number() {
    return Number.parseInt(this._text.text());
  }

  get textFontFamily() {
    return this._text.attr('font-family');
  }

  set textFontFamily(ff) {
    this._text.attr({ 'font-family': ff });
  }

  get textFontSize() {
    return this._text.attr('font-size');
  }

  set textFontSize(fs) {
    this._text.attr({ 'font-size': fs });
  }

  get textFontWeight() {
    return this._text.attr('font-weight');
  }

  set textFontWeight(fw) {
    this._text.attr({ 'font-weight': fw });
  }

  get color() {
    return this._text.attr('fill');
  }

  set color(c) {
    this._text.attr({ 'fill': c });
    this._line.attr({ 'stroke': c });
  }

  get lineStrokeWidth() {
    return this._line.attr('stroke-width');
  }

  set lineStrokeWidth(lsw) {
    this._line.attr({ 'stroke-width': lsw });
  }
}

export default Numbering;
