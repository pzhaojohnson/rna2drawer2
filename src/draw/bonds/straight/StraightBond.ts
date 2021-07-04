import { StraightBondInterface } from './StraightBondInterface';
import * as SVG from '@svgdotjs/svg.js';
import { BaseInterface as Base } from 'Draw/BaseInterface';
import { distance2D as distance } from 'Math/distance';
import { areClose } from 'Draw/areClose';
import { assignUuid } from 'Draw/svg/id';
import { SVGLineWrapper as LineWrapper } from 'Draw/svg/line';
import { position } from './position';

interface LineCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export class StraightBond implements StraightBondInterface {
  readonly line: SVG.Line;
  readonly base1: Base;
  readonly base2: Base;

  _basePadding1: number;
  _basePadding2: number;

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
    if (line.type != 'line') {
      throw new Error('The passed element is not a line.');
    }

    this.line = line;
    this.base1 = b1;
    this.base2 = b2;

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
    return this.line.attr('id');
  }

  contains(b: Base): boolean {
    return this.base1.id == b.id || this.base2.id == b.id;
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
    position(this, {
      basePadding1: bp1,
      basePadding2: this.basePadding2,
    });
    this._basePadding1 = bp1;
  }

  get basePadding2(): number {
    return this._basePadding2;
  }

  set basePadding2(bp2) {
    position(this, {
      basePadding1: this.basePadding1,
      basePadding2: bp2,
    });
    this._basePadding2 = bp2;
  }

  /**
   * Repositions this straight bond based on the current positions of its bases.
   */
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

export default StraightBond;
