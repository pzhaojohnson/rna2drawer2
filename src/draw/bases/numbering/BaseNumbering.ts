import {
  BaseNumberingInterface,
  Repositioning,
  SavableState,
} from './BaseNumberingInterface';
import * as SVG from '@svgdotjs/svg.js';
import { Point2D as Point } from 'Math/Point';
import { distance2D as distance } from 'Math/distance';
import { position } from './position';

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

  _baseCenter: Point;
  
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
    n.reposition();
  }

  static updateDefaults(n: BaseNumbering) {
    BaseNumbering.defaults.basePadding = n.basePadding ?? BaseNumbering.defaults.basePadding;
    BaseNumbering.defaults.lineLength = n.lineLength ?? BaseNumbering.defaults.lineLength;
    BaseNumbering.defaults.text['font-family'] = n.text.attr('font-family');
    BaseNumbering.defaults.text['font-size'] = n.text.attr('font-size');
    BaseNumbering.defaults.text['font-weight'] = n.text.attr('font-weight');
    BaseNumbering.defaults.text['fill'] = n.text.attr('fill');
    BaseNumbering.defaults.line['stroke'] = n.line.attr('stroke');
    BaseNumbering.defaults.line['stroke-width'] = n.line.attr('stroke-width');
  }

  static fromSavedState(
    savedState: SavableState,
    svg: SVG.Svg,
    baseCenter: Point,
  ): (BaseNumbering | never) {
    if (savedState.className !== 'BaseNumbering') {
      throw new Error('Wrong class name.');
    }
    let text = svg.findOne('#' + savedState.textId);
    let line = svg.findOne('#' + savedState.lineId);
    let n = new BaseNumbering(text as SVG.Text, line as SVG.Line, baseCenter);
    BaseNumbering.updateDefaults(n);
    return n;
  }

  static create(svg: SVG.Svg, number: number, baseCenter: Point): (BaseNumbering | never) {
    let line = svg.line(1, 2, 3, 4);
    let text = svg.text((add) => add.tspan(number.toString()));
    let n = new BaseNumbering(text, line, baseCenter);
    BaseNumbering.applyDefaults(n);
    return n;
  }

  constructor(text: SVG.Text, line: SVG.Line, baseCenter: Point) {
    this.text = text;
    this._validateText();

    this.line = line;
    this._validateLine();

    this._baseCenter = { ...baseCenter };
  }

  _validateText(): void | never {
    if (this.text.type != 'text') {
      throw new Error('Passed element is not a text.');
    }
    this.text.id();
  }

  _validateLine(): void | never {
    if (this.line.type != 'line') {
      throw new Error('Passed element is not a line.');
    }
    this.line.id();
  }

  get id(): string {
    return this.text.id();
  }

  get basePadding(): number | undefined {
    let lx1 = this.line.attr('x1');
    let ly1 = this.line.attr('y1');
    if (typeof lx1 == 'number' && typeof ly1 == 'number') {
      return distance(this._baseCenter.x, this._baseCenter.y, lx1, ly1);
    }
  }

  set basePadding(bp) {
    if (typeof bp == 'number') {
      this.reposition({ basePadding: bp });
    }
  }

  get lineAngle(): number | undefined {
    let lx1 = this.line.attr('x1');
    let ly1 = this.line.attr('y1');
    let lx2 = this.line.attr('x2');
    let ly2 = this.line.attr('y2');
    if (
      typeof lx1 == 'number'
      && typeof ly1 == 'number'
      && typeof lx2 == 'number'
      && typeof ly2 == 'number'
    ) {
      return Math.atan2(ly2 - ly1, lx2 - lx1);
    }
  }

  set lineAngle(la) {
    if (typeof la == 'number') {
      this.reposition({ lineAngle: la });
    }
  }

  get lineLength(): number | undefined {
    let lx1 = this.line.attr('x1');
    let ly1 = this.line.attr('y1');
    let lx2 = this.line.attr('x2');
    let ly2 = this.line.attr('y2');
    if (
      typeof lx1 == 'number'
      && typeof ly1 == 'number'
      && typeof lx2 == 'number'
      && typeof ly2 == 'number'
    ) {
      return distance(lx1, ly1, lx2, ly2);
    }
  }

  set lineLength(ll) {
    if (typeof ll == 'number') {
      this.reposition({ lineLength: ll });
    }
  }

  get textPadding(): number {
    return 4;
  }

  reposition(rp?: Repositioning) {
    position(this, {
      baseCenter: rp?.baseCenter ?? this._baseCenter,
      basePadding: rp?.basePadding ?? this.basePadding ?? BaseNumbering.defaults.basePadding,
      lineAngle: rp?.lineAngle ?? this.lineAngle ?? 0,
      lineLength: rp?.lineLength ?? this.lineLength ?? BaseNumbering.defaults.lineLength,
      textPadding: this.textPadding,
    });
    if (rp && rp.baseCenter) {
      this._baseCenter = { ...rp.baseCenter };
    }
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

  savableState(): SavableState {
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
