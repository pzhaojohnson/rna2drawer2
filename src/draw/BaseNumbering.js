import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';

class BaseNumbering {

  /**
   * @typedef {Object} BaseNumbering~LineCoordinates 
   * @property {number} x1 
   * @property {number} y1 
   * @property {number} x2 
   * @property {number} y2 
   */

  /**
   * @param {number} xBaseCenter 
   * @param {number} yBaseCenter 
   * @param {number} angle 
   * @param {number} basePadding 
   * @param {number} length 
   * 
   * @returns {BaseNumbering~LineCoordinates} 
   */
  static _lineCoordinates(xBaseCenter, yBaseCenter, angle, basePadding, length) {
    let x1 = xBaseCenter + (basePadding * Math.cos(angle));
    let y1 = yBaseCenter + (basePadding * Math.sin(angle));
    let x2 = x1 + (length * Math.cos(angle));
    let y2 = y1 + (length * Math.sin(angle));
    return { x1: x1, y1: y1, x2: x2, y2: y2 };
  }

  /**
   * @typedef {Object} BaseNumbering~TextPositioning 
   * @property {number} x 
   * @property {number} y 
   * @property {string} textAnchor 
   * @property {string} dominantBaseline 
   */

  /**
   * @param {SVG.Line} line 
   * 
   * @returns {BaseNumbering~TextPositioning} 
   */
  static _textPositioning(line) {
    let lineAngle = angleBetween(
      line.attr('x1'),
      line.attr('y1'),
      line.attr('x2'),
      line.attr('y2'),
    );
    lineAngle = normalizeAngle(lineAngle, 0);
    let textPadding = 4;
    let tp = {
      x: line.attr('x2') + textPadding,
      y: line.attr('y2'),
      textAnchor: 'start',
      dominantBaseline: 'middle',
    };
    if (lineAngle >= Math.PI / 4 && lineAngle < 3 * Math.PI / 4) {
      tp.x = line.attr('x2');
      tp.y = line.attr('y2') + textPadding;
      tp.textAnchor = 'middle';
      tp.dominantBaseline = 'hanging';
    } else if (lineAngle >= 3 * Math.PI / 4 && lineAngle < 5 * Math.PI / 4) {
      tp.x = line.attr('x2') - textPadding;
      tp.y = line.attr('y2');
      tp.textAnchor = 'end';
      tp.dominantBaseline = 'middle';
    } else if (lineAngle >= 5 * Math.PI / 4 && lineAngle < 7 * Math.PI / 4) {
      tp.x = line.attr('x2');
      tp.y = line.attr('y2') - textPadding;
      tp.textAnchor = 'middle';
      tp.dominantBaseline = 'baseline';
    }
    return tp;
  }

  /**
   * @typedef {Object} BaseNumbering~MostRecentProps 
   * @property {number} basePadding 
   * @property {number} lineLength 
   * @property {string} fontFamily 
   * @property {number} fontSize 
   * @property {string|number} fontWeight 
   * @property {string} color 
   * @property {number} lineStrokeWidth 
   */

  /**
   * @returns {BaseNumbering~MostRecentProps} 
   */
  static mostRecentProps() {
    return { ...BaseNumbering._mostRecentProps };
  }

  /**
   * @param {BaseNumbering} n 
   */
  static _applyMostRecentProps(n) {
    let props = BaseNumbering.mostRecentProps();
    n.basePadding = props.basePadding;
    n.lineLength = props.lineLength;
    n.fontFamily = props.fontFamily;
    n.fontSize = props.fontSize;
    n.fontWeight = props.fontWeight;
    n.color = props.color;
    n.lineStrokeWidth = props.lineStrokeWidth;
  }

  /**
   * @param {BaseNumbering} n 
   */
  static _copyPropsToMostRecent(n) {
    BaseNumbering._mostRecentProps.basePadding = n.basePadding;
    BaseNumbering._mostRecentProps.lineLength = n.lineLength;
    BaseNumbering._mostRecentProps.fontFamily = n.fontFamily;
    BaseNumbering._mostRecentProps.fontSize = n.fontSize;
    BaseNumbering._mostRecentProps.fontWeight = n.fontWeight;
    BaseNumbering._mostRecentProps.color = n.color;
    BaseNumbering._mostRecentProps.lineStrokeWidth = n.lineStrokeWidth;
  }

  /**
   * Returns null if the saved state is invalid.
   * 
   * @param {BaseNumbering~SavableState} savedState 
   * @param {SVG.Svg} svg 
   * @param {number} xBaseCenter 
   * @param {number} yBaseCenter 
   * 
   * @returns {BaseNumbering|null} 
   */
  static fromSavedState(savedState, svg, xBaseCenter, yBaseCenter) {
    if (savedState.className !== 'BaseNumbering') {
      return null;
    }
    let text = svg.findOne('#' + savedState.textId);
    let line = svg.findOne('#' + savedState.lineId);
    let n = null;
    try {
      n = new BaseNumbering(text, line, xBaseCenter, yBaseCenter);
    } catch (err) {}
    if (!n) {
      return null;
    }
    BaseNumbering._copyPropsToMostRecent(n);
    return n;
  }

  /**
   * Returns null if the given number is not an integer.
   * 
   * @param {SVG.Svg} svg 
   * @param {number} number 
   * @param {number} xBaseCenter 
   * @param {number} yBaseCenter 
   * 
   * @returns {BaseNumbering|null} 
   */
  static create(svg, number, xBaseCenter, yBaseCenter) {
    let lc = BaseNumbering._lineCoordinates(xBaseCenter, yBaseCenter, 0, 10, 8);
    let line = svg.line(lc.x1, lc.y1, lc.x2, lc.y2);
    line.id();
    let text = svg.text((add) => add.tspan(number.toString()));
    text.id();
    let tp = BaseNumbering._textPositioning(line);
    text.attr({
      'x': tp.x,
      'y': tp.y,
      'text-anchor': tp.textAnchor,
      'dominant-baseline': tp.dominantBaseline,
    });
    let n = null;
    try {
      n = new BaseNumbering(text, line, xBaseCenter, yBaseCenter);
    } catch (err) {}
    if (!n) {
      return null;
    }
    BaseNumbering._applyMostRecentProps(n);
    return n;
  }

  /**
   * @param {SVG.Text} text 
   * @param {SVG.Line} line 
   * @param {number} xBaseCenter 
   * @param {number} yBaseCenter 
   * 
   * @throws {Error} If the text content is not an integer.
   */
  constructor(text, line, xBaseCenter, yBaseCenter) {
    this._text = text;
    this._validateText();

    this._line = line;
    this._validateLine();
    this._storeBasePadding(xBaseCenter, yBaseCenter);
  }

  /**
   * Initializes the ID of the text if it is not already initialized.
   * 
   * @throws {Error} If the text content is not an integer.
   */
  _validateText() {
    this._text.id();
    let n = Number(this._text.text());
    if (!isFinite(n) || Math.floor(n) !== n) {
      throw new Error('Text content is not an integer.');
    }
  }

  /**
   * Initializes the ID of the line if it is not already initializes.
   */
  _validateLine() {
    this._line.id();
  }

  /**
   * @returns {string} 
   */
  get id() {
    return this._text.id();
  }

  /**
   * Derived from the current base padding and positions of the line.
   * 
   * @returns {number} 
   */
  get _xBaseCenter() {
    return this._line.attr('x1') + (this.basePadding * Math.cos(this.lineAngle + Math.PI));
  }

  /**
   * Derived from the current base padding and positions of the line.
   * 
   * @returns {number} 
   */
  get _yBaseCenter() {
    return this._line.attr('y1') + (this.basePadding * Math.sin(this.lineAngle + Math.PI));
  }

  /**
   * Sets the _basePadding property.
   * 
   * @param {number} xBaseCenter 
   * @param {number} yBaseCenter 
   */
  _storeBasePadding(xBaseCenter, yBaseCenter) {
    this._basePadding = distanceBetween(
      xBaseCenter,
      yBaseCenter,
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
    this._reposition(
      this._xBaseCenter,
      this._yBaseCenter,
      this.lineAngle,
      bp,
      this.lineLength,
    );
    BaseNumbering._mostRecentProps.basePadding = bp;
  }

  /**
   * @returns {number} 
   */
  get lineAngle() {
    return angleBetween(
      this._line.attr('x1'),
      this._line.attr('y1'),
      this._line.attr('x2'),
      this._line.attr('y2'),
    );
  }

  /**
   * @param {number} la 
   */
  set lineAngle(la) {
    this._reposition(
      this._xBaseCenter,
      this._yBaseCenter,
      la,
      this.basePadding,
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
    this._reposition(
      this._xBaseCenter,
      this._yBaseCenter,
      this.lineAngle,
      this.basePadding,
      ll,
    );
    BaseNumbering._mostRecentProps.lineLength = ll;
  }

  /**
   * @param {number} xBaseCenter 
   * @param {number} yBaseCenter 
   */
  reposition(xBaseCenter, yBaseCenter) {
    this._reposition(
      xBaseCenter,
      yBaseCenter,
      this.lineAngle,
      this.basePadding,
      this.lineLength,
    );
  }

  /**
   * @param {number} xBaseCenter 
   * @param {number} yBaseCenter 
   * @param {number} lineAngle 
   * @param {number} basePadding 
   * @param {number} lineLength 
   */
  _reposition(xBaseCenter, yBaseCenter, lineAngle, basePadding, lineLength) {
    let lc = BaseNumbering._lineCoordinates(
      xBaseCenter,
      yBaseCenter,
      lineAngle,
      basePadding,
      lineLength,
    );
    this._line.attr({ 'x1': lc.x1, 'y1': lc.y1, 'x2': lc.x2, 'y2': lc.y2 });
    let tp = BaseNumbering._textPositioning(this._line);
    this._text.attr({
      'x': tp.x,
      'y': tp.y,
      'text-anchor': tp.textAnchor,
      'dominant-baseline': tp.dominantBaseline,
    });
    this._storeBasePadding(xBaseCenter, yBaseCenter);
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
    return Number(this._text.text());
  }

  /**
   * Has no effect if the given number is not an integer.
   * 
   * @param {number} n 
   */
  set number(n) {
    if (!Number.isFinite(n) || Math.floor(n) !== n) {
      return;
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
    BaseNumbering._mostRecentProps.fontFamily = ff;
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
    BaseNumbering._mostRecentProps.fontSize = fs;
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
    BaseNumbering._mostRecentProps.fontWeight = fw;
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
    BaseNumbering._mostRecentProps.color = c;
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
    BaseNumbering._mostRecentProps.lineStrokeWidth = lsw;
  }

  remove() {
    this._text.remove();
    this._line.remove();
  }

  /**
   * @typedef {Object} BaseNumbering~SavableState 
   * @property {string} className 
   * @property {string} textId 
   * @property {string} lineId 
   */

  /**
   * @returns {BaseNumbering~SavableState} 
   */
  savableState() {
    return {
      className: 'BaseNumbering',
      textId: this._text.id(),
      lineId: this._line.id(),
    };
  }
}

BaseNumbering._mostRecentProps = {
  basePadding: 8,
  lineLength: 8,
  fontFamily: 'Arial',
  fontSize: 8,
  fontWeight: 'normal',
  color: '#808080',
  lineStrokeWidth: 1,
};

export default BaseNumbering;
