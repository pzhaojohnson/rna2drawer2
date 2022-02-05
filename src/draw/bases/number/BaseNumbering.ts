import {
  BaseNumberingInterface,
  Repositioning,
} from './BaseNumberingInterface';
import * as SVG from '@svgdotjs/svg.js';
import { SVGTextWrapper as Text } from 'Draw/svg/SVGTextWrapper';
import { Values } from './values';
import { Point2D as Point } from 'Math/points/Point';
import { distance2D as distance } from 'Math/distance';
import { position } from './position';
import { assignUuid } from 'Draw/svg/assignUuid';

export class BaseNumbering implements BaseNumberingInterface {
  static recommendedDefaults: Values;

  readonly text: Text;
  readonly line: SVG.Line;

  _baseCenter: Point;

  constructor(text: Text, line: SVG.Line, baseCenter: Point) {
    if (text.wrapped.type != 'text') {
      throw new Error('Wrapped element is not a text.');
    }
    if (line.type != 'line') {
      throw new Error('Element is not a line.');
    }

    this.text = text;
    this.line = line;

    // use the attr method to check if an ID is initialized
    // since the id method itself will initialize an ID (to
    // a non-UUID)
    if (!this.text.attr('id')) {
      assignUuid(this.text);
    }
    if (!this.line.attr('id')) {
      assignUuid(this.line);
    }

    this._baseCenter = { ...baseCenter };
  }

  get id(): string {
    return String(this.text.id());
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
}

BaseNumbering.recommendedDefaults = {
  text: {
    'font-family': 'Arial',
    'font-size': 8,
    'font-weight': 'normal',
    'fill': '#808080',
    'fill-opacity': 1,
  },
  line: {
    'stroke': '#808080',
    'stroke-width': 1,
    'stroke-opacity': 1,
  },
  basePadding: 8,
  lineLength: 8,
};
