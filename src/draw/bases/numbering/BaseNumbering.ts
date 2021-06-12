import {
  BaseNumberingInterface,
  BaseNumberingSavableState,
} from './BaseNumberingInterface';
import * as SVG from '@svgdotjs/svg.js';
import { distance2D as distance } from 'Math/distance';
import angleBetween from 'Draw/angleBetween';
import normalizeAngle from 'Draw/normalizeAngle';

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
  static defaults: {
    text: {
      'font-family': string;
      'font-size': number;
      'font-weight': number | string;
      'fill': string,
    }
    line: {
      'stroke': string;
      'stroke-width': number;
    }
    basePadding: number;
    lineLength: number;
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
    let defaults = BaseNumbering.defaults;
    n.basePadding = defaults.basePadding;
    n.lineLength = defaults.lineLength;
    n.text.attr({ 'font-family': defaults.text['font-family'] });
    n.text.attr({ 'font-size': defaults.text['font-size'] });
    n.text.attr({ 'font-weight': defaults.text['font-weight'] });
    n.text.attr({ 'fill': defaults.text['fill'] });
    n.line.attr({ 'stroke': defaults.line['stroke'] });
    n.line.attr({ 'stroke-width': defaults.line['stroke-width'] });
    BaseNumbering._positionText(n.text, n.line);
  }

  static updateDefaults(n: BaseNumbering) {
    BaseNumbering.defaults.basePadding = n.basePadding;
    BaseNumbering.defaults.lineLength = n.lineLength;
    BaseNumbering.defaults.text['font-family'] = n.text.attr('font-family');
    BaseNumbering.defaults.text['font-size'] = n.text.attr('font-size');
    BaseNumbering.defaults.text['font-weight'] = n.text.attr('font-weight');
    BaseNumbering.defaults.text['fill'] = n.text.attr('fill');
    BaseNumbering.defaults.line['stroke'] = n.line.attr('stroke');
    BaseNumbering.defaults.line['stroke-width'] = n.line.attr('stroke-width');
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
    BaseNumbering.defaults.basePadding = bp;
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
    BaseNumbering.defaults.lineLength = ll;
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

  repositionText() {
    BaseNumbering._positionText(this.text, this.line);
  }

  bringToFront() {
    this.line.front();
    this.text.front();
  }

  sendToBack() {
    this.text.back();
    this.line.back();
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

BaseNumbering.defaults = {
  text: {
    'font-family': 'Arial',
    'font-size': 8,
    'font-weight': 'normal',
    'fill': '#808080',
  },
  line: {
    'stroke': '#808080',
    'stroke-width': 1,
  },
  basePadding: 8,
  lineLength: 8,
};
