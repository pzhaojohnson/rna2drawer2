import { QuadraticBezierBondInterface } from './QuadraticBezierBondInterface';
import * as Svg from '@svgdotjs/svg.js';
import { BaseInterface as Base } from 'Draw/BaseInterface';
import { distance2D as distance } from 'Math/distance';
import angleBetween from 'Draw/angleBetween';
import normalizeAngle from 'Draw/normalizeAngle';
import { assignUuid } from 'Draw/svg/id';
import { SVGPathWrapper as PathWrapper } from 'Draw/svg/path';
import {
  Positioning,
  positioning,
  ControlPointDisplacement,
} from './positioning';
import { position } from './position';

class QuadraticBezierBond implements QuadraticBezierBondInterface {
  readonly path: Svg.Path;
  readonly base1: Base;
  readonly base2: Base;

  _positioning: Positioning;

  static _dPath(
    b1: Base,
    b2: Base,
    basePadding1: number,
    basePadding2: number,
    controlHeight: number,
    controlAngle: number,
  ): string {
    let xMiddle = (b1.xCenter + b2.xCenter) / 2;
    let yMiddle = (b1.yCenter + b2.yCenter) / 2;
    let ca = b1.angleBetweenCenters(b2) + controlAngle;
    let xControl = xMiddle + (controlHeight * Math.cos(ca));
    let yControl = yMiddle + (controlHeight * Math.sin(ca));
    let a1 = angleBetween(b1.xCenter, b1.yCenter, xControl, yControl);
    let x1 = b1.xCenter + (basePadding1 * Math.cos(a1));
    let y1 = b1.yCenter + (basePadding1 * Math.sin(a1));
    let a2 = angleBetween(b2.xCenter, b2.yCenter, xControl, yControl);
    let x2 = b2.xCenter + (basePadding2 * Math.cos(a2));
    let y2 = b2.yCenter + (basePadding2 * Math.sin(a2));
    return ['M', x1, y1, 'Q', xControl, yControl, x2, y2].join(' ');
  }

  constructor(path: Svg.Path, b1: Base, b2: Base) {
    this.base1 = b1;
    this.base2 = b2;

    this.path = path;

    // use the attr method to check if the ID is already
    // initialized since the id method itself will initialize
    // the ID (to a non-UUID)
    if (!this.path.attr('id')) {
      assignUuid(new PathWrapper(this.path));
    }

    this._validatePath();

    this._positioning = positioning(this) ?? {
      basePadding1: 8,
      basePadding2: 8,
      controlPointDisplacement: {
        magnitude: 0,
        angle: 0,
      },
    };
  }

  _validatePath(): (void | never) {
    if (this.path.type !== 'path') {
      throw new Error('The given element is not a path element.');
    }
    let pa = this.path.array();
    if (pa.length !== 2) {
      throw new Error('Invalid path.');
    }
    let m = pa[0];
    let q = pa[1];
    if (m[0] !== 'M' || q[0] !== 'Q') {
      throw new Error('Invalid path.');
    }
  }

  get id(): string {
    return this.path.id();
  }

  contains(b: Base): boolean {
    return this.base1.id == b.id || this.base2.id == b.id;
  }

  get x1(): number {
    let pa = this.path.array();
    let m = pa[0];
    return m[1] as number;
  }

  get y1(): number {
    let pa = this.path.array();
    let m = pa[0];
    return m[2] as number;
  }

  get x2(): number {
    let pa = this.path.array();
    let q = pa[1];
    return q[3] as number;
  }

  get y2(): number {
    let pa = this.path.array();
    let q = pa[1];
    return q[4] as number;
  }

  get xControl(): number {
    let pa = this.path.array();
    let q = pa[1];
    return q[1] as number;
  }

  get yControl(): number {
    let pa = this.path.array();
    let q = pa[1];
    return q[2] as number;
  }

  get basePadding1() {
    return this._positioning.basePadding1;
  }

  set basePadding1(bp1) {
    this._positioning.basePadding1 = bp1;
    this.reposition();
  }

  get basePadding2() {
    return this._positioning.basePadding2;
  }

  set basePadding2(bp2) {
    this._positioning.basePadding2 = bp2;
    this.reposition();
  }

  controlPointDisplacement(): ControlPointDisplacement {
    return { ...this._positioning.controlPointDisplacement };
  }

  setControlPointDisplacement(cpd: ControlPointDisplacement) {
    this._positioning.controlPointDisplacement = { ...cpd };
    this.reposition();
  }

  reposition() {
    position(this, this._positioning);
  }

  bringToFront() {
    this.path.front();
  }

  sendToBack() {
    this.path.back();
  }

  refreshIds() {
    assignUuid(new PathWrapper(this.path));
  }
}

export { QuadraticBezierBond };
