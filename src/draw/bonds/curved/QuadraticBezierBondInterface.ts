import { BaseInterface as Base } from 'Draw/BaseInterface';
import * as SVG from '@svgdotjs/svg.js';
import { ControlPointDisplacement } from './positioning';

export interface QuadraticBezierBondSavableState {
  className: string;
  pathId: string;
  baseId1: string;
  baseId2: string;
}

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
  setControlPointDisplacement(cbd: ControlPointDisplacement): void;
  shiftControl(xShift: number, yShift: number): void;
  reposition(): void;
  bringToFront(): void;
  sendToBack(): void;
  remove(): void;
  hasBeenRemoved(): boolean;
  savableState(): QuadraticBezierBondSavableState;
  refreshIds(): void;
}

export default QuadraticBezierBondInterface;
