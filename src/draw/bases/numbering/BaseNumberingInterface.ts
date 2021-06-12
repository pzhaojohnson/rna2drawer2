import * as SVG from '@svgdotjs/svg.js';

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
  reposition(xBaseCenter: number, yBaseCenter: number): void;
  bringToFront(): void;
  sendToBack(): void;
  number: number;
  fontWeight: number | string;
  color: string;
  lineStrokeWidth: number;
  remove(): void;
  savableState(): BaseNumberingSavableState;
  refreshIds(): void;
}
