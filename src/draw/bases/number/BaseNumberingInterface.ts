import * as SVG from '@svgdotjs/svg.js';
import { SVGTextWrapper as Text } from 'Draw/svg/SVGTextWrapper';
import { Point2D as Point } from 'Math/points/Point';

export type Repositioning = {
  baseCenter?: Point;
  basePadding?: number;
  lineAngle?: number;
  lineLength?: number;
}

export interface BaseNumberingInterface {
  readonly text: Text;
  readonly line: SVG.Line;
  readonly id: string;
  basePadding: number | undefined;
  lineAngle: number | undefined;
  lineLength: number | undefined;
  readonly textPadding: number;
  reposition(rp?: Repositioning): void;
}
