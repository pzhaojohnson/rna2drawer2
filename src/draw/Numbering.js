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

  create(svg, number, xCenterBase, yCenterBase, angle, defaults) {
    let lc = this._lineCoordinates(xCenterBase, yCenterBase, angle, defaults.lineLength);
    let line = svg.line(lc.x1, lc.y1, lc.x2, lc.y2);
    
    line.attr({
      'id': createUUIDforSVG(),
      'stroke': defaults.color,
      'stroke-width': defaults.lineStrokeWidth,
    });

    let text = svg.text((add) => add.tspan(number));
    let tp = this._textPositioning(line);

    text.attr({
      'id': createUUIDforSVG(),
      'x': tp.x,
      'y': tp.y,
      'text-anchor': tp.textAnchor,
      'dy': tp.dy,
      'font-family': defaults.textFontFamily,
      'font-size': defaults.textFontSize,
      'font-weight': defaults.textFontWeight,
      'fill': defaults.color,
    });
    
    return new Numbering(text, line, xCenterBase, yCenterBase);
  }

  constructor(text, line, xCenterBase, yCenterBase) {
    this._text = text;
    this._validateText();

    this._line = line;
    this._validateLine();
    this._storeBasePadding(xCenterBase, yCenterBase);
  }

  _validateText() {}

  _validateLine() {}

  _storeBasePadding(xCenterBase, yCenterBase) {
    this._basePadding = distanceBetween(
      xCenterBase,
      yCenterBase,
      this._line.attr('x1'),
      this._line.attr('y1'),
    );
  }

  get basePadding() {
    return this._basePadding;
  }

  reposition(xCenterBase, yCenterBase, angle) {
    let lc = Numbering._lineCoordinates(xCenterBase, yCenterBase, angle, this.basePadding, this.lineLength);

    this._line.attr({
      'x1': lc.x1,
      'y1': lc.y1,
      'x2': lc.x1,
      'y2': lc.x2,
    });

    let tp = Numbering._textPositioning(this._line);

    this._text.attr({
      'x': tp.x,
      'y': tp.y,
      'text-anchor': tp.textAnchor,
      'dy': tp.dy,
    });

    this._storeBasePadding(xCenterBase, yCenterBase);
  }

  insertBefore(ele) {
    this._text.insertBefore(ele);
    this._line.insertBefore(ele);
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

  get lineLength() {
    return distanceBetween(
      this._line.attr('x1'),
      this._line.attr('y1'),
      this._line.attr('x2'),
      this._line.attr('y2'),
    );
  }

  get lineStrokeWidth() {
    return this._line.attr('stroke-width');
  }
}

export default Numbering;
