import * as Svg from '@svgdotjs/svg.js';
import { Point2D as Point } from 'Math/points/Point';
import {
  CircleBaseAnnotationInterface as CircleBaseAnnotation,
} from "Draw/bases/annotate/circle/CircleBaseAnnotationInterface";
import { BaseNumberingInterface as BaseNumbering } from "Draw/bases/number/BaseNumberingInterface";

export interface BaseInterface {
  readonly text: Svg.Text;
  readonly id: string;
  character: string;
  center(): Point;
  xCenter: number;
  yCenter: number;
  recenter(p: { x: number, y: number }): void;

  highlighting?: CircleBaseAnnotation;
  outline?: CircleBaseAnnotation;
  numbering?: BaseNumbering;
}
