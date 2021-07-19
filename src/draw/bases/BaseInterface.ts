import * as Svg from '@svgdotjs/svg.js';
import {
  CircleBaseAnnotationInterface as CircleBaseAnnotation,
} from "Draw/bases/annotate/circle/CircleBaseAnnotationInterface";
import { SavableState as SavableCircleAnnotationState } from 'Draw/bases/annotate/circle/save';
import { BaseNumberingInterface as BaseNumbering } from "Draw/bases/number/BaseNumberingInterface";
import { SavableState as SavableBaseNumberingState } from 'Draw/bases/number/save';

export interface BaseSavableState {
  className: string;
  textId: string;
  highlighting?: SavableCircleAnnotationState;
  outline?: SavableCircleAnnotationState;
  numbering?: SavableBaseNumberingState;
}

export interface BaseInterface {
  readonly text: Svg.Text;
  readonly id: string;
  character: string;
  xCenter: number;
  yCenter: number;
  moveTo(xCenter: number, yCenter: number): void;
  distanceBetweenCenters(b: BaseInterface): number;
  angleBetweenCenters(b: BaseInterface): number;

  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  fontStyle: string;
  fill: string;
  fillOpacity: number;
  cursor: string;

  bringToFront(): void;
  sendToBack(): void;

  highlighting?: CircleBaseAnnotation;
  outline?: CircleBaseAnnotation;
  numbering?: BaseNumbering;
  
  remove(): void;
  savableState(): BaseSavableState;
  refreshIds(): void;
}

export default BaseInterface;
