import {
  QuadraticBezierBondInterface,
  QuadraticBezierBondSavableState,
} from './QuadraticBezierBondInterface';
import * as Svg from '@svgdotjs/svg.js';
import { BaseInterface as Base } from 'Draw/BaseInterface';
import { distance2D as distance } from 'Math/distance';
import angleBetween from 'Draw/angleBetween';
import normalizeAngle from 'Draw/normalizeAngle';

class QuadraticBezierBond implements QuadraticBezierBondInterface {
  readonly path: Svg.Path;
  readonly base1: Base;
  readonly base2: Base;

  _basePadding1: number;
  _basePadding2: number;
  _controlHeight!: number;
  _controlAngle!: number;

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

  /**
   * Throws if the path element is not actually a path element.
   *
   * Initializes the ID of the path if it is not already initialized.
   *
   * Sets fill-opacity to zero.
   *
   * Throws if the path is not composed of an M and Q segment.
   */
  constructor(path: Svg.Path, b1: Base, b2: Base) {
    this.base1 = b1;
    this.base2 = b2;

    this.path = path;
    this._validatePath();

    this._basePadding1 = 0;
    this._basePadding2 = 0;
    this._storeBasePaddings();

    this._storeControlHeightAndAngle();
  }

  _validatePath(): (void | never) {
    if (this.path.type !== 'path') {
      throw new Error('The given element is not a path element.');
    }
    this.path.id();
    this.path.attr({ 'fill-opacity': 0 });
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

  _storeBasePaddings() {
    this._basePadding1 = distance(
      this.base1.xCenter,
      this.base1.yCenter,
      this.x1,
      this.y1,
    );
    this._basePadding2 = distance(
      this.base2.xCenter,
      this.base2.yCenter,
      this.x2,
      this.y2,
    );
  }

  get basePadding1() {
    return this._basePadding1;
  }

  set basePadding1(bp1) {
    this._basePadding1 = bp1;
    this.reposition();
  }

  get basePadding2() {
    return this._basePadding2;
  }

  set basePadding2(bp2) {
    this._basePadding2 = bp2;
    this.reposition();
  }

  /**
   * Sets the _controlHeight and _controlAngle properties.
   */
  _storeControlHeightAndAngle() {
    let xMiddle = (this.base1.xCenter + this.base2.xCenter) / 2;
    let yMiddle = (this.base1.yCenter + this.base2.yCenter) / 2;
    this._controlHeight = distance(
      xMiddle,
      yMiddle,
      this.xControl,
      this.yControl,
    );
    let a12 = this.base1.angleBetweenCenters(this.base2);
    let ca = angleBetween(
      xMiddle,
      yMiddle,
      this.xControl,
      this.yControl,
    );
    this._controlAngle = normalizeAngle(ca, a12) - a12;
  }

  shiftControl(xShift: number, yShift: number) {
    let xMiddle = (this.base1.xCenter + this.base2.xCenter) / 2;
    let yMiddle = (this.base1.yCenter + this.base2.yCenter) / 2;
    let xControl = this.xControl + xShift;
    let yControl = this.yControl + yShift;
    let controlHeight = distance(xMiddle, yMiddle, xControl, yControl);
    let ca = angleBetween(xMiddle, yMiddle, xControl, yControl);
    let a12 = this.base1.angleBetweenCenters(this.base2);
    let controlAngle = normalizeAngle(ca, a12) - a12;
    this._reposition(this.basePadding1, this.basePadding2, controlHeight, controlAngle);
  }

  reposition() {
    this._reposition(
      this.basePadding1,
      this.basePadding2,
      this._controlHeight,
      this._controlAngle
    );
  }

  _reposition(basePadding1: number, basePadding2: number, controlHeight: number, controlAngle: number) {
    this.path.plot(
      QuadraticBezierBond._dPath(
        this.base1,
        this.base2,
        basePadding1,
        basePadding2,
        controlHeight,
        controlAngle,
      ),
    );
    this._storeBasePaddings();
    this._storeControlHeightAndAngle();
  }

  bringToFront() {
    this.path.front();
  }

  sendToBack() {
    this.path.back();
  }

  remove() {
    this.path.remove();
  }

  hasBeenRemoved() {
    return !this.path.root();
  }

  savableState(): QuadraticBezierBondSavableState {
    return {
      className: 'QuadraticBezierBond',
      pathId: this.path.id(),
      baseId1: this.base1.id,
      baseId2: this.base2.id,
    };
  }

  refreshIds() {
    this.path.id('');
    this.path.id();
  }
}

export { QuadraticBezierBond };
