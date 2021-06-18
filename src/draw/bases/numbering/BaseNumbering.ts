import {
  BaseNumberingInterface,
  Repositioning,
} from './BaseNumberingInterface';
import * as SVG from '@svgdotjs/svg.js';
import { Values } from './values';
import { Point2D as Point } from 'Math/Point';
import { distance2D as distance } from 'Math/distance';
import { position } from './position';

export class BaseNumbering implements BaseNumberingInterface {
  static recommendedDefaults: Values;

  readonly text: SVG.Text;
  readonly line: SVG.Line;

  _baseCenter: Point;

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
    let defaults = BaseNumbering.recommendedDefaults;
    position(this, {
      baseCenter: rp?.baseCenter ?? this._baseCenter,
      basePadding: rp?.basePadding ?? this.basePadding ?? defaults.basePadding ?? 8,
      lineAngle: rp?.lineAngle ?? this.lineAngle ?? 0,
      lineLength: rp?.lineLength ?? this.lineLength ?? defaults.lineLength ?? 8,
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

  refreshIds() {
    this.text.id('');
    this.text.id();
    this.line.id('');
    this.line.id();
  }
}

BaseNumbering.recommendedDefaults = {
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
