import * as SVG from '@svgdotjs/svg.js';
import { BaseInterface as Base } from 'Draw/BaseInterface'

export interface StraightBondSavableState {
  className: string;
  lineId: string;
  baseId1: string;
  baseId2: string;
}

export interface StraightBondInterface {
  readonly line: SVG.Line;
  readonly base1: Base;
  readonly base2: Base;
  id: string;
  contains(b: Base): boolean;
  getPadding1(): number;
  setPadding1(p: number): void;
  getPadding2(): number;
  setPadding2(p: number): void;
  reposition(): void;
  readonly opacity: number;
  bringToFront(): void;
  sendToBack(): void;
  remove(): void;
  savableState(): StraightBondSavableState;
  refreshIds(): void;
}

export default StraightBondInterface;
