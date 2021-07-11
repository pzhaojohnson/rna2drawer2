import { BaseInterface as Base } from 'Draw/BaseInterface';
import * as SVG from '@svgdotjs/svg.js';
import { ControlPointDisplacement } from './positioning';

export interface QuadraticBezierBondInterface {
  readonly id: string;
  readonly path: SVG.Path;
  readonly base1: Base;
  readonly base2: Base;
  contains(b: Base): boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  xControl: number;
  yControl: number;
  basePadding1: number;
  basePadding2: number;
  controlPointDisplacement(): ControlPointDisplacement;
  setControlPointDisplacement(cpd: ControlPointDisplacement): void;
  shiftControl(xShift: number, yShift: number): void;
  reposition(): void;
  bringToFront(): void;
  sendToBack(): void;
  refreshIds(): void;
}

export default QuadraticBezierBondInterface;
