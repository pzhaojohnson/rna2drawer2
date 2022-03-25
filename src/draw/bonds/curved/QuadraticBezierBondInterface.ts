import * as SVG from '@svgdotjs/svg.js';
import type { Base } from 'Draw/bases/Base';
import { ControlPointDisplacement } from './positioning';

export interface QuadraticBezierBondInterface {
  readonly id: string;
  readonly path: SVG.Path;
  readonly base1: Base;
  readonly base2: Base;
  contains(node: SVG.Element | Node): boolean;
  binds(b: Base): boolean;
  basePadding1: number;
  basePadding2: number;
  controlPointDisplacement(): ControlPointDisplacement;
  setControlPointDisplacement(cpd: ControlPointDisplacement): void;
  reposition(): void;
}
