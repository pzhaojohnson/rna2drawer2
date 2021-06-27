import * as SVG from '@svgdotjs/svg.js';
import { Point2D as Point } from 'Math/Point';

export interface CircleBaseAnnotationInterface {
  readonly circle: SVG.Circle;
  readonly id: string;
  reposition(baseCenter: Point): void;
  bringToFront(): void;
  sendToBack(): void;
  refreshIds(): void;
}
