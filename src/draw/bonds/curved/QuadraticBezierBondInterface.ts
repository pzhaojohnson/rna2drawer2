import { BaseInterface as Base } from 'Draw/BaseInterface';
import * as SVG from '@svgdotjs/svg.js';

export interface QuadraticBezierBondSavableState {
  className: string;
  pathId: string;
  baseId1: string;
  baseId2: string;
}

export interface QuadraticBezierBondInterface {
  readonly id: string;
  readonly path: SVG.Path;
  base1: Base;
  base2: Base;
  contains(b: Base): boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  xControl: number;
  yControl: number;
  getPadding1(): number;
  setPadding1(p: number): void;
  getPadding2(): number;
  setPadding2(p: number): void;
  shiftControl(xShift: number, yShift: number): void;
  reposition(): void;
  getStroke(): string;
  setStroke(s: string): void;
  getStrokeWidth(): number;
  setStrokeWidth(sw: number): void;
  getStrokeOpacity(): number;
  setStrokeOpacity(so: number): void;
  fill: string;
  fillOpacity: number;
  bringToFront(): void;
  sendToBack(): void;
  cursor: string;
  onMouseover(f: () => void): void;
  onMouseout(f: () => void): void;
  onMousedown(f: () => void): void;
  onDblclick(f: () => void): void;
  remove(): void;
  hasBeenRemoved(): boolean;
  savableState(): QuadraticBezierBondSavableState;
  refreshIds(): void;
}

export default QuadraticBezierBondInterface;
