import {
  BaseNumberingInterface,
  BaseNumberingSavableState,
} from './BaseNumberingInterface';
import * as SVG from '@svgdotjs/svg.js';
import { distance2D as distance } from 'Math/distance';
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

export class BaseNumbering implements BaseNumberingInterface {
  static defaultAttrs: {
    text: {
      'font-family': string;
      'font-size': number;
      'font-weight': number | string;
    }
    line: {
      'stroke-width': number;
    }
  }

  static defaultProps: {
    basePadding: number;
    lineLength: number;
    color: string;
  }

  readonly text: SVG.Text;
  readonly line: SVG.Line;
  _basePadding: number;

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

  static _textPositioning(text: SVG.Text, line: SVG.Line): TextPositioning {
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

  static _positionText(text: SVG.Text, line: SVG.Line) {
    let tp = BaseNumbering._textPositioning(text, line);
    text.attr({
      'x': tp.x,
      'y': tp.y,
      'text-anchor': tp.textAnchor,
    });
  }

  static applyDefaults(n: BaseNumbering) {
    let attrs = BaseNumbering.defaultAttrs;
    let props = BaseNumbering.defaultProps;
    n.basePadding = props.basePadding;
    n.lineLength = props.lineLength;
    n.fontFamily = attrs.text['font-family'];
    n.fontSize = attrs.text['font-size'];
    n.fontWeight = attrs.text['font-weight'];
    n.color = props.color;
    n.lineStrokeWidth = attrs.line['stroke-width'];
  }

  static updateDefaults(n: BaseNumbering) {
    BaseNumbering.defaultProps.basePadding = n.basePadding;
    BaseNumbering.defaultProps.lineLength = n.lineLength;
    BaseNumbering.defaultAttrs.text['font-family'] = n.fontFamily;
    BaseNumbering.defaultAttrs.text['font-size'] = n.fontSize;
    BaseNumbering.defaultAttrs.text['font-weight'] = n.fontWeight;
    BaseNumbering.defaultProps.color = n.color;
    BaseNumbering.defaultAttrs.line['stroke-width'] = n.lineStrokeWidth;
  }

  static fromSavedState(
    savedState: BaseNumberingSavableState,
    svg: SVG.Svg,
    xBaseCenter: number,
    yBaseCenter: number,
  ): (BaseNumbering | never) {
    if (savedState.className !== 'BaseNumbering') {
      throw new Error('Wrong class name.');
    }
    let text = svg.findOne('#' + savedState.textId);
    let line = svg.findOne('#' + savedState.lineId);
    let n = new BaseNumbering(text as SVG.Text, line as SVG.Line, xBaseCenter, yBaseCenter);
    BaseNumbering.updateDefaults(n);
    return n;
  }

  static create(
    svg: SVG.Svg,
    number: number,
    xBaseCenter: number,
    yBaseCenter: number,
  ): (BaseNumbering | never) {
    let lc = BaseNumbering._lineCoordinates(xBaseCenter, yBaseCenter, 0, 10, 8);
    let line = svg.line(lc.x1, lc.y1, lc.x2, lc.y2);
    let text = svg.text((add) => add.tspan(number.toString()));
    BaseNumbering._positionText(text, line);
    let n = new BaseNumbering(text, line, xBaseCenter, yBaseCenter);
    BaseNumbering.applyDefaults(n);
    return n;
  }

  constructor(text: SVG.Text, line: SVG.Line, xBaseCenter: number, yBaseCenter: number) {
    this.text = text;
    this._validateText();

    this.line = line;
    this._validateLine();

    this._basePadding = 0;
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
    if (this.text.type !== 'text') {
      throw new Error('Passed element is not a text element.');
    }
    this.text.id();
    let n = Number(this.text.text());
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
    if (this.line.type !== 'line') {
      throw new Error('Passed element is not a line element.');
    }
    this.line.id();
  }

  get id(): string {
    return this.text.id();
  }

  /**
   * Derived from the current base padding and positions of the line.
   */
  get _xBaseCenter(): number {
    return this.line.attr('x1') + (this.basePadding * Math.cos(this.lineAngle + Math.PI));
  }

  /**
   * Derived from the current base padding and positions of the line.
   */
  get _yBaseCenter(): number {
    return this.line.attr('y1') + (this.basePadding * Math.sin(this.lineAngle + Math.PI));
  }

  /**
   * Sets the _basePadding property.
   */
  _storeBasePadding(xBaseCenter: number, yBaseCenter: number) {
    this._basePadding = distance(
      xBaseCenter,
      yBaseCenter,
      this.line.attr('x1'),
      this.line.attr('y1'),
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
    BaseNumbering.defaultProps.basePadding = bp;
  }

  get lineAngle(): number {
    return angleBetween(
      this.line.attr('x1'),
      this.line.attr('y1'),
      this.line.attr('x2'),
      this.line.attr('y2'),
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
    return distance(
      this.line.attr('x1'),
      this.line.attr('y1'),
      this.line.attr('x2'),
      this.line.attr('y2'),
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
    BaseNumbering.defaultProps.lineLength = ll;
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
    this.line.attr({ 'x1': lc.x1, 'y1': lc.y1, 'x2': lc.x2, 'y2': lc.y2 });
    BaseNumbering._positionText(this.text, this.line);
    this._storeBasePadding(xBaseCenter, yBaseCenter);
  }

  bringToFront() {
    this.line.front();
    this.text.front();
  }

  sendToBack() {
    this.text.back();
    this.line.back();
  }

  get number(): number {
    return Number(this.text.text());
  }

  /**
   * Has no effect if the given number is not an integer.
   */
  set number(n: number) {
    if (!Number.isFinite(n) || Math.floor(n) !== n) {
      console.error('Given number is not an integer.');
      return;
    }
    this.text.clear();
    this.text.tspan(n.toString());
  }

  get fontFamily(): string {
    return this.text.attr('font-family');
  }

  set fontFamily(ff: string) {
    this.text.attr({ 'font-family': ff });
    BaseNumbering.defaultAttrs.text['font-family'] = ff;
  }

  get fontSize(): number {
    return this.text.attr('font-size');
  }

  set fontSize(fs: number) {
    this.text.attr({ 'font-size': fs });
    BaseNumbering._positionText(this.text, this.line);
    BaseNumbering.defaultAttrs.text['font-size'] = fs;
  }

  get fontWeight(): (number | string) {
    return this.text.attr('font-weight');
  }

  set fontWeight(fw: (number | string)) {
    this.text.attr({ 'font-weight': fw });
    BaseNumbering.defaultAttrs.text['font-weight'] = fw;
  }

  get color(): string {
    return this.text.attr('fill');
  }

  set color(c: string) {
    this.text.attr({ 'fill': c });
    this.line.attr({ 'stroke': c });
    BaseNumbering.defaultProps.color = c;
  }

  get lineStrokeWidth(): number {
    return this.line.attr('stroke-width');
  }

  set lineStrokeWidth(lsw: number) {
    this.line.attr({ 'stroke-width': lsw });
    BaseNumbering.defaultAttrs.line['stroke-width'] = lsw;
  }

  remove() {
    this.text.remove();
    this.line.remove();
  }

  savableState(): BaseNumberingSavableState {
    return {
      className: 'BaseNumbering',
      textId: this.text.id(),
      lineId: this.line.id(),
    };
  }

  refreshIds() {
    this.text.id('');
    this.text.id();
    this.line.id('');
    this.line.id();
  }
}

BaseNumbering.defaultAttrs = {
  text: {
    'font-family': 'Arial',
    'font-size': 8,
    'font-weight': 'normal',
  },
  line: {
    'stroke-width': 1,
  },
};

BaseNumbering.defaultProps = {
  basePadding: 8,
  lineLength: 8,
  color: '#808080',
};
