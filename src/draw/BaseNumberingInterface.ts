import { SvgElementInterface as SvgElement } from './SvgInterface';

export interface BaseNumberingMostRecentProps {
  basePadding: number;
  lineLength: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  color: string;
  lineStrokeWidth: number;
}

export interface BaseNumberingSavableState {
  className: string;
  textId: string;
  lineId: string;
}

export interface BaseNumberingInterface {
  readonly id: string;
  basePadding: number;
  lineAngle: number;
  lineLength: number;
  reposition(xBaseCenter: number, yBaseCenter: number): void;
  insertBefore(ele: SvgElement): void;
  insertAfter(ele: SvgElement): void;
  number: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  color: string;
  lineStrokeWidth: number;
  remove(): void;
  savableState(): BaseNumberingSavableState;
  refreshIds(): void;
}

export default BaseNumberingInterface;
