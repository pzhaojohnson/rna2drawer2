import * as SVG from '@svgdotjs/svg.js';
import { Point2D as Point } from 'Math/Point';

export type Repositioning = {
  baseCenter?: Point;
  basePadding?: number;
  lineAngle?: number;
  lineLength?: number;
}

export type SavableState = {
  className: 'BaseNumbering';
  textId: string;
  lineId: string;
}

export interface BaseNumberingInterface {
  readonly text: SVG.Text;
  readonly line: SVG.Line;
  readonly id: string;
  basePadding: number | undefined;
  lineAngle: number | undefined;
  lineLength: number | undefined;
  readonly textPadding: number;
  reposition(rp?: Repositioning): void;
  bringToFront(): void;
  sendToBack(): void;
  remove(): void;
  savableState(): SavableState;
  refreshIds(): void;
}