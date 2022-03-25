import * as SVG from '@svgdotjs/svg.js';
import type { Base } from 'Draw/bases/Base';
import { distance2D as distance } from 'Math/distance';
import { assignUuid } from 'Draw/svg/assignUuid';
import { position } from './position';

export class StraightBond {
  readonly line: SVG.Line;
  readonly base1: Base;
  readonly base2: Base;

  _basePadding1: number;
  _basePadding2: number;

  constructor(line: SVG.Line, base1: Base, base2: Base) {
    if (line.type != 'line') {
      throw new Error('Element is not a line.');
    }

    this.line = line;
    this.base1 = base1;
    this.base2 = base2;

    // use the attr method to check if the ID
    // is initialized since the id method itself
    // will initialize the ID (to a non-UUID)
    if (!this.line.attr('id')) {
      assignUuid(this.line);
    }

    this._basePadding1 = 0;
    this._basePadding2 = 0;
    this._storeBasePaddings();
  }

  get id(): string {
    return String(this.line.id());
  }

  contains(node: SVG.Element | Node): boolean {
    if (node instanceof SVG.Element) {
      node = node.node;
    }
    return this.line.node == node || this.line.node.contains(node);
  }

  binds(b: Base): boolean {
    return b == this.base1 || b == this.base2;
  }

  _storeBasePaddings() {
    let baseCenter1 = { x: this.base1.xCenter, y: this.base1.yCenter };
    let x1 = this.line.attr('x1');
    let y1 = this.line.attr('y1');
    if (typeof x1 == 'number' && typeof y1 == 'number') {
      this._basePadding1 = distance(baseCenter1.x, baseCenter1.y, x1, y1);
    }
    let baseCenter2 = { x: this.base2.xCenter, y: this.base2.yCenter };
    let x2 = this.line.attr('x2');
    let y2 = this.line.attr('y2');
    if (typeof x2 == 'number' && typeof y2 == 'number') {
      this._basePadding2 = distance(baseCenter2.x, baseCenter2.y, x2, y2);
    }
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
}
