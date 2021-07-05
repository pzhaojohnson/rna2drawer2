import { StraightBondInterface } from './StraightBondInterface';
import * as SVG from '@svgdotjs/svg.js';
import { BaseInterface as Base } from 'Draw/BaseInterface';
import { distance2D as distance } from 'Math/distance';
import { assignUuid } from 'Draw/svg/id';
import { SVGLineWrapper as LineWrapper } from 'Draw/svg/line';
import { position } from './position';

export class StraightBond implements StraightBondInterface {
  readonly line: SVG.Line;
  readonly base1: Base;
  readonly base2: Base;

  _basePadding1: number;
  _basePadding2: number;

  constructor(line: SVG.Line, base1: Base, base2: Base) {
    if (line.type != 'line') {
      throw new Error('The passed SVG element is not a line.');
    }

    this.line = line;
    this.base1 = base1;
    this.base2 = base2;

    // use the attr method to check if the ID
    // is initialized since the id method itself
    // will initialize the ID (to a non-UUID)
    if (!this.line.attr('id')) {
      assignUuid(new LineWrapper(this.line));
    }

    this._basePadding1 = 0;
    this._basePadding2 = 0;
    this._storeBasePaddings();
  }

  get id(): string {
    return String(this.line.id());
  }

  contains(b: Base): boolean {
    return b == this.base1 || b == this.base2;
  }

  _storeBasePaddings() {
    this._basePadding1 = distance(
      this.base1.xCenter,
      this.base1.yCenter,
      this.line.attr('x1'),
      this.line.attr('y1'),
    );
    this._basePadding2 = distance(
      this.base2.xCenter,
      this.base2.yCenter,
      this.line.attr('x2'),
      this.line.attr('y2'),
    );
  }

  get basePadding1(): number {
    return this._basePadding1;
  }

  set basePadding1(bp1) {
    this._basePadding1 = bp1;
    this.reposition();
  }

  get basePadding2(): number {
    return this._basePadding2;
  }

  set basePadding2(bp2) {
    this._basePadding2 = bp2;
    this.reposition();
  }

  reposition() {
    position(this, {
      basePadding1: this.basePadding1,
      basePadding2: this.basePadding2,
    });
  }

  bringToFront() {
    this.line.front();
  }

  sendToBack() {
    this.line.back();
  }

  refreshIds() {
    assignUuid(new LineWrapper(this.line));
  }
}
