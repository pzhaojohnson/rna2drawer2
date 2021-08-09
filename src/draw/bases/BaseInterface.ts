import * as Svg from '@svgdotjs/svg.js';
import {
  CircleBaseAnnotationInterface as CircleBaseAnnotation,
} from "Draw/bases/annotate/circle/CircleBaseAnnotationInterface";
import { BaseNumberingInterface as BaseNumbering } from "Draw/bases/number/BaseNumberingInterface";

export interface BaseInterface {
  readonly text: Svg.Text;
  readonly id: string;
  character: string;
  center(): { x: unknown, y: unknown };
  xCenter: number;
  yCenter: number;
  recenter(p: { x: number, y: number }): void;
  moveTo(xCenter: number, yCenter: number): void;
  
  highlighting?: CircleBaseAnnotation;
  outline?: CircleBaseAnnotation;
  numbering?: BaseNumbering;
}

export default BaseInterface;
