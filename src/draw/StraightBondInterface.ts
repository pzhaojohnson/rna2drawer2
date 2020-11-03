import * as Svg from '@svgdotjs/svg.js';
import { BaseInterface as Base } from './BaseInterface'

export interface StraightBondSavableState {
  className: string;
  lineId: string;
  baseId1: string;
  baseId2: string;
}

export interface StraightBondInterface {
  id: string;
  base1: Base;
  base2: Base;
  contains(b: Base): boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  getPadding1(): number;
  setPadding1(p: number): void;
  getPadding2(): number;
  setPadding2(p: number): void;
  reposition(): void;
  insertBefore(ele: Svg.Element): void;
  insertAfter(ele: Svg.Element): void;
  getStroke(): string;
  setStroke(s: string): void;
  getStrokeWidth(): number;
  setStrokeWidth(sw: number): void;
  readonly opacity: number;
  remove(): void;
  savableState(): StraightBondSavableState;
  refreshIds(): void;
}

export interface PrimaryBondMostRecentProps {
  padding1: number;
  padding2: number;
  stroke: string;
  strokeWidth: number;
}

export interface PrimaryBondInterface extends StraightBondInterface {
  padding1: number;
  padding2: number;
  stroke: string;
  strokeWidth: number;
}

export interface SecondaryBondMostRecentProps {
  padding1: number;
  padding2: number;
  autStroke: string;
  gcStroke: string;
  gutStroke: string;
  otherStroke: string;
  strokeWidth: number;
}

export interface SecondaryBondInterface extends StraightBondInterface {
  isAUT(): boolean;
  isGC(): boolean;
  isGUT(): boolean;
  padding1: number;
  padding2: number;
  stroke: string;
  strokeWidth: number;
}

export default StraightBondInterface;
