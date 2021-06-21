import {
  BaseNumberingInterface,
  Repositioning,
} from './BaseNumberingInterface';
import * as SVG from '@svgdotjs/svg.js';
import { SVGTextWrapper as TextWrapper } from 'Draw/svg/text';
import { SVGLineWrapper as LineWrapper } from 'Draw/svg/line';
import { Values } from './values';
import { Point2D as Point } from 'Math/Point';
import { distance2D as distance } from 'Math/distance';
import { position } from './position';
import { regenerateId } from 'Draw/svg/regenerateId';

export class BaseNumbering implements BaseNumberingInterface {
  static recommendedDefaults: Values;

  readonly text: TextWrapper;
  readonly line: LineWrapper;

  _baseCenter: Point;

  constructor(text: SVG.Text, line: SVG.Line, baseCenter: Point) {
    this.text = new TextWrapper(text);
    this._validateText();

    this.line = new LineWrapper(line);
    this._validateLine();

    this._baseCenter = { ...baseCenter };
  }

  _validateText(): void | never {
    if (this.text.element.type != 'text') {
      throw new Error('Passed element is not a text.');
    }
    this.text.id();
  }

  _validateLine(): void | never {
    if (this.line.element.type != 'line') {
      throw new Error('Passed element is not a line.');
    }
    this.line.id();
  }

  get id(): string | undefined {
    let id = this.text.id();
    return typeof id == 'string' ? id : undefined;
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

  regenerateIds() {
    regenerateId(this.text);
    regenerateId(this.line);
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
