import * as SVG from '@svgdotjs/svg.js';
import { Point2D as Point } from 'Math/Point';

export interface BaseNumberingSavableState {
  className: string;
  textId: string;
  lineId: string;
}

export interface BaseNumberingInterface {
  readonly text: SVG.Text;
  readonly line: SVG.Line;
  readonly id: string;
  basePadding: number;
  lineAngle: number;
  lineLength: number;
  reposition(baseCenter: Point): void;
  repositionText(): void;
  bringToFront(): void;
  sendToBack(): void;
  remove(): void;
  savableState(): BaseNumberingSavableState;
  refreshIds(): void;
}
