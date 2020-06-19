import {
  BaseNumberingInterface,
  BaseNumberingMostRecentProps,
  BaseNumberingSavableState,
} from './BaseNumberingInterface';
import {
  SvgInterface as Svg,
  SvgTextInterface as SvgText,
  SvgLineInterface as SvgLine,
  SvgElementInterface as SvgElement,
} from './SvgInterface';
import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';

interface LineCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface TextPositioning {
  x: number;
  y: number;
  textAnchor: string;
}

class BaseNumbering implements BaseNumberingInterface {
  static _mostRecentProps: BaseNumberingMostRecentProps;

  _text: SvgText;
  _line: SvgLine;
  _basePadding!: number;

  static _lineCoordinates(
    xBaseCenter: number,
    yBaseCenter: number,
    angle: number,
    basePadding: number,
    length: number,
  ): LineCoordinates {
    let x1 = xBaseCenter + (basePadding * Math.cos(angle));
    let y1 = yBaseCenter + (basePadding * Math.sin(angle));
    let x2 = x1 + (length * Math.cos(angle));
    let y2 = y1 + (length * Math.sin(angle));
    return { x1: x1, y1: y1, x2: x2, y2: y2 };
  }

  static _textPositioning(text: SvgText, line: SvgLine): TextPositioning {
    let lineAngle = angleBetween(
      line.attr('x1'),
      line.attr('y1'),
      line.attr('x2'),
      line.attr('y2'),
    );
    lineAngle = normalizeAngle(lineAngle, 0);
    let textPadding = 4;
    let fs = 0.8 * text.attr('font-size');
    let tp = {
      x: line.attr('x2') + textPadding,
      y: line.attr('y2') + (fs / 2),
      textAnchor: 'start',
    };
    if (lineAngle >= Math.PI / 4 && lineAngle < 3 * Math.PI / 4) {
      tp.x = line.attr('x2');
      tp.y = line.attr('y2') + textPadding + fs;
      tp.textAnchor = 'middle';
    } else if (lineAngle >= 3 * Math.PI / 4 && lineAngle < 5 * Math.PI / 4) {
      tp.x = line.attr('x2') - textPadding;
      tp.y = line.attr('y2') + (fs / 2);
      tp.textAnchor = 'end';
    } else if (lineAngle >= 5 * Math.PI / 4 && lineAngle < 7 * Math.PI / 4) {
      tp.x = line.attr('x2');
      tp.y = line.attr('y2') - textPadding;
      tp.textAnchor = 'middle';
    }
    return tp;
  }

  static _positionText(text: SvgText, line: SvgLine) {
    let tp = BaseNumbering._textPositioning(text, line);
    text.attr({
      'x': tp.x,
      'y': tp.y,
      'text-anchor': tp.textAnchor,
    });
  }

  static mostRecentProps(): BaseNumberingMostRecentProps {
    return { ...BaseNumbering._mostRecentProps };
  }

  static _applyMostRecentProps(n: BaseNumbering) {
    let props = BaseNumbering.mostRecentProps();
    n.basePadding = props.basePadding;
    n.lineLength = props.lineLength;
    n.fontFamily = props.fontFamily;
    n.fontSize = props.fontSize;
    n.fontWeight = props.fontWeight;
    n.color = props.color;
    n.lineStrokeWidth = props.lineStrokeWidth;
  }

  static _copyPropsToMostRecent(n: BaseNumbering) {
    BaseNumbering._mostRecentProps.basePadding = n.basePadding;
    BaseNumbering._mostRecentProps.lineLength = n.lineLength;
    BaseNumbering._mostRecentProps.fontFamily = n.fontFamily;
    BaseNumbering._mostRecentProps.fontSize = n.fontSize;
    BaseNumbering._mostRecentProps.fontWeight = n.fontWeight;
    BaseNumbering._mostRecentProps.color = n.color;
    BaseNumbering._mostRecentProps.lineStrokeWidth = n.lineStrokeWidth;
  }

  static fromSavedState(
    savedState: BaseNumberingSavableState,
    svg: Svg,
    xBaseCenter: number,
    yBaseCenter: number,
  ): (BaseNumbering | never) {
    if (savedState.className !== 'BaseNumbering') {
      throw new Error('Wrong class name.');
    }
    let text = svg.findOne('#' + savedState.textId) as SvgText;
    let line = svg.findOne('#' + savedState.lineId) as SvgLine;
    let n = new BaseNumbering(text, line, xBaseCenter, yBaseCenter);
    BaseNumbering._copyPropsToMostRecent(n);
    return n;
  }

  static create(
    svg: Svg,
    number: number,
    xBaseCenter: number,
    yBaseCenter: number,
  ): (BaseNumbering | never) {
    let lc = BaseNumbering._lineCoordinates(xBaseCenter, yBaseCenter, 0, 10, 8);
    let line = svg.line(lc.x1, lc.y1, lc.x2, lc.y2);
    let text = svg.text((add) => add.tspan(number.toString()));
    BaseNumbering._positionText(text, line);
    let n = new BaseNumbering(text, line, xBaseCenter, yBaseCenter);
    BaseNumbering._applyMostRecentProps(n);
    return n;
  }

  constructor(text: SvgText, line: SvgLine, xBaseCenter: number, yBaseCenter: number) {
    this._text = text;
    this._validateText();

    this._line = line;
    this._validateLine();
    this._storeBasePadding(xBaseCenter, yBaseCenter);
  }

  /**
   * Throws if the text element is not actually a text element.
   * 
   * Initializes the ID of the text if it is not already initialized.
   * 
   * Throws if the text content is not an integer.
   */
  _validateText(): (void | never) {
    if (this._text.type !== 'text') {
      throw new Error('Passed element is not a text element.');
    }
    this._text.id();
    let n = Number(this._text.text());
    if (!Number.isFinite(n) || Math.floor(n) !== n) {
      throw new Error('Text content is not an integer.');
    }
  }

  /**
   * Throws if the line element is not actually a line element.
   * 
   * Initializes the ID of the line if it is not already initialized.
   */
  _validateLine() {
    if (this._line.type !== 'line') {
      throw new Error('Passed element is not a line element.');
    }
    this._line.id();
  }

  get id(): string {
    return this._text.id();
  }

  /**
   * Derived from the current base padding and positions of the line.
   */
  get _xBaseCenter(): number {
    return this._line.attr('x1') + (this.basePadding * Math.cos(this.lineAngle + Math.PI));
  }

  /**
   * Derived from the current base padding and positions of the line.
   */
  get _yBaseCenter(): number {
    return this._line.attr('y1') + (this.basePadding * Math.sin(this.lineAngle + Math.PI));
  }

  /**
   * Sets the _basePadding property.
   */
  _storeBasePadding(xBaseCenter: number, yBaseCenter: number) {
    this._basePadding = distanceBetween(
      xBaseCenter,
      yBaseCenter,
      this._line.attr('x1'),
      this._line.attr('y1'),
    );
  }

  get basePadding(): number {
    return this._basePadding;
  }

  set basePadding(bp: number) {
    this._reposition(
      this._xBaseCenter,
      this._yBaseCenter,
      this.lineAngle,
      bp,
      this.lineLength,
    );
    BaseNumbering._mostRecentProps.basePadding = bp;
  }

  get lineAngle(): number {
    return angleBetween(
      this._line.attr('x1'),
      this._line.attr('y1'),
      this._line.attr('x2'),
      this._line.attr('y2'),
    );
  }

  set lineAngle(la: number) {
    this._reposition(
      this._xBaseCenter,
      this._yBaseCenter,
      la,
      this.basePadding,
      this.lineLength,
    );
  }

  get lineLength(): number {
    return distanceBetween(
      this._line.attr('x1'),
      this._line.attr('y1'),
      this._line.attr('x2'),
      this._line.attr('y2'),
    );
  }

  set lineLength(ll: number) {
    this._reposition(
      this._xBaseCenter,
      this._yBaseCenter,
      this.lineAngle,
      this.basePadding,
      ll,
    );
    BaseNumbering._mostRecentProps.lineLength = ll;
  }

  reposition(xBaseCenter: number, yBaseCenter: number) {
    this._reposition(
      xBaseCenter,
      yBaseCenter,
      this.lineAngle,
      this.basePadding,
      this.lineLength,
    );
  }

  _reposition(
    xBaseCenter: number,
    yBaseCenter: number,
    lineAngle: number,
    basePadding: number,
    lineLength: number,
  ) {
    let lc = BaseNumbering._lineCoordinates(
      xBaseCenter,
      yBaseCenter,
      lineAngle,
      basePadding,
      lineLength,
    );
    this._line.attr({ 'x1': lc.x1, 'y1': lc.y1, 'x2': lc.x2, 'y2': lc.y2 });
    BaseNumbering._positionText(this._text, this._line);
    this._storeBasePadding(xBaseCenter, yBaseCenter);
  }

  insertBefore(ele: SvgElement) {
    this._text.insertBefore(ele);
    this._line.insertBefore(ele);
  }

  insertAfter(ele: SvgElement) {
    this._text.insertAfter(ele);
    this._line.insertAfter(ele);
  }

  get number(): number {
    return Number(this._text.text());
  }

  /**
   * Has no effect if the given number is not an integer.
   */
  set number(n: number) {
    if (!Number.isFinite(n) || Math.floor(n) !== n) {
      console.error('Given number is not an integer.');
      return;
    }
    this._text.clear();
    this._text.tspan(n.toString());
  }

  get fontFamily(): string {
    return this._text.attr('font-family');
  }

  set fontFamily(ff: string) {
    this._text.attr({ 'font-family': ff });
    BaseNumbering._mostRecentProps.fontFamily = ff;
  }

  get fontSize(): number {
    return this._text.attr('font-size');
  }

  set fontSize(fs: number) {
    this._text.attr({ 'font-size': fs });
    BaseNumbering._positionText(this._text, this._line);
    BaseNumbering._mostRecentProps.fontSize = fs;
  }

  get fontWeight(): (number | string) {
    return this._text.attr('font-weight');
  }

  set fontWeight(fw: (number | string)) {
    this._text.attr({ 'font-weight': fw });
    BaseNumbering._mostRecentProps.fontWeight = fw;
  }

  get color(): string {
    return this._text.attr('fill');
  }

  set color(c: string) {
    this._text.attr({ 'fill': c });
    this._line.attr({ 'stroke': c });
    BaseNumbering._mostRecentProps.color = c;
  }

  get lineStrokeWidth(): number {
    return this._line.attr('stroke-width');
  }

  set lineStrokeWidth(lsw: number) {
    this._line.attr({ 'stroke-width': lsw });
    BaseNumbering._mostRecentProps.lineStrokeWidth = lsw;
  }

  remove() {
    this._text.remove();
    this._line.remove();
  }

  savableState(): BaseNumberingSavableState {
    return {
      className: 'BaseNumbering',
      textId: this._text.id(),
      lineId: this._line.id(),
    };
  }

  refreshIds() {
    this._text.id(null);
    this._text.id();
    this._line.id(null);
    this._line.id();
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
