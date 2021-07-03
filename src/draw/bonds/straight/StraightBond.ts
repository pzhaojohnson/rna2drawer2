import {
  StraightBondInterface,
  StraightBondSavableState,
} from './StraightBondInterface';
import * as SVG from '@svgdotjs/svg.js';
import Base from 'Draw/Base';
import { distance2D as distance } from 'Math/distance';
import { areClose } from 'Draw/areClose';

interface LineCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function lineCoordinatesAreClose(lcs1: LineCoordinates, lcs2: LineCoordinates): boolean {
  return areClose(lcs1.x1, lcs2.x1)
    && areClose(lcs1.y1, lcs2.y1)
    && areClose(lcs1.x2, lcs2.x2)
    && areClose(lcs1.y2, lcs2.y2);
}

export class StraightBond implements StraightBondInterface {
  readonly line: SVG.Line;
  readonly base1: Base;
  readonly base2: Base;

  _padding1!: number;
  _padding2!: number;

  _coordinates: LineCoordinates;

  static _lineCoordinates(b1: Base, b2: Base, padding1: number, padding2: number): LineCoordinates {
    let angle = b1.angleBetweenCenters(b2);
    return {
      x1: b1.xCenter + (padding1 * Math.cos(angle)),
      y1: b1.yCenter + (padding1 * Math.sin(angle)),
      x2: b2.xCenter - (padding2 * Math.cos(angle)),
      y2: b2.yCenter - (padding2 * Math.sin(angle)),
    };
  }

  static _opacity(b1: Base, b2: Base, padding1: number, padding2: number): number {
    if (padding1 + padding2 > b1.distanceBetweenCenters(b2)) {
      return 0;
    }
    return 1;
  }

  constructor(line: SVG.Line, b1: Base, b2: Base) {
    this.base1 = b1;
    this.base2 = b2;

    this.line = line;
    this._validateLine();

    this._storePaddings();

    this._coordinates = { x1: 0, y1: 0, x2: 0, y2: 0 };
    this._storeCoordinates();
  }

  /**
   * Throws if the line element is not actually a line element.
   *
   * Initializes the ID of the line if it is not already initialized.
   */
  _validateLine(): (void | never) {
    if (this.line.type !== 'line') {
      throw new Error('The given element is not a line element.');
    }
    this.line.id();
  }

  get id(): string {
    return this.line.attr('id');
  }

  contains(b: Base): boolean {
    return this.base1.id == b.id || this.base2.id == b.id;
  }

  _storeCoordinates() {
    this._coordinates = {
      x1: this.line.attr('x1'),
      y1: this.line.attr('y1'),
      x2: this.line.attr('x2'),
      y2: this.line.attr('y2'),
    };
  }

  get x1(): number {
    return this._coordinates.x1;
  }

  get y1(): number {
    return this._coordinates.y1;
  }

  get x2(): number {
    return this._coordinates.x2;
  }

  get y2(): number {
    return this._coordinates.y2;
  }

  /**
   * Sets the _padding1 and _padding2 properties.
   */
  _storePaddings() {
    this._padding1 = distance(
      this.base1.xCenter,
      this.base1.yCenter,
      this.line.attr('x1'),
      this.line.attr('y1'),
    );
    this._padding2 = distance(
      this.base2.xCenter,
      this.base2.yCenter,
      this.line.attr('x2'),
      this.line.attr('y2'),
    );
  }

  getPadding1(): number {
    return this._padding1;
  }

  setPadding1(p: number) {
    this._reposition(p, this.getPadding2());
  }

  getPadding2(): number {
    return this._padding2;
  }

  setPadding2(p: number) {
    this._reposition(this.getPadding1(), p);
  }

  /**
   * Repositions this straight bond based on the current positions of its bases.
   */
  reposition() {
    this._reposition(this.getPadding1(), this.getPadding2());
  }

  _reposition(padding1: number, padding2: number) {
    let cs = StraightBond._lineCoordinates(this.base1, this.base2, padding1, padding2);
    if (!lineCoordinatesAreClose(cs, this._coordinates)) {
      this.line.attr({
        'x1': cs.x1,
        'y1': cs.y1,
        'x2': cs.x2,
        'y2': cs.y2,
      });
      this._coordinates = { ...cs };
      this._padding1 = padding1;
      this._padding2 = padding2;
      let opacity = StraightBond._opacity(this.base1, this.base2, padding1, padding2);
      this._setOpacity(opacity);
    }
  }

  getStroke(): string {
    return this.line.attr('stroke');
  }

  setStroke(s: string) {
    this.line.attr({ 'stroke': s });
  }

  get opacity(): number {
    return this.line.attr('opacity');
  }

  _setOpacity(o: number) {
    this.line.attr({ 'opacity': o });
  }

  bringToFront() {
    this.line.front();
  }

  sendToBack() {
    this.line.back();
  }

  remove() {
    this.line.remove();
  }

  savableState(): StraightBondSavableState {
    return {
      className: 'StraightBond',
      lineId: this.line.id(),
      baseId1: this.base1.id,
      baseId2: this.base2.id,
    };
  }

  refreshIds() {
    this.line.id('');
    this.line.id();
  }
}

export default StraightBond;
