import { SvgElementInterface as SvgElement, SvgElementInterface } from './SvgInterface';
import Base from './Base'

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
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  padding1: number;
  getPadding1(): number;
  setPadding1(p: number): void;
  padding2: number;
  getPadding2(): number;
  setPadding2(p: number): void;
  reposition(): void;
  insertBefore(ele: SvgElement): void;
  insertAfter(ele: SvgElement): void;
  stroke: string;
  getStroke(): string;
  setStroke(s: string): void;
  strokeWidth: number;
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

export interface PrimaryBondInterface extends StraightBondInterface {}

export interface SecondaryBondMostRecentProps {
  padding1: number;
  padding2: number;
  autStroke: string;
  gcStroke: string;
  gutStroke: string;
  otherStroke: string;
  strokeWidth: number;
}

export interface SecondaryBondInterface extends StraightBondInterface {}

export default StraightBondInterface;
