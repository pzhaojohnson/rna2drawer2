import * as SVG from '@svgdotjs/svg.js';

export interface CircleBaseAnnotationInterface {
  readonly circle: SVG.Circle;
  readonly id: string;
  reposition(xBaseCenter: number, yBaseCenter: number): void;
  bringToFront(): void;
  sendToBack(): void;
  refreshIds(): void;
}
