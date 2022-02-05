import * as SVG from '@svgdotjs/svg.js';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface'

export interface StraightBondInterface {
  readonly line: SVG.Line;
  readonly base1: Base;
  readonly base2: Base;
  id: string;
  contains(node: SVG.Element | Node): boolean;
  binds(b: Base): boolean;
  basePadding1: number;
  basePadding2: number;
  reposition(): void;
}
