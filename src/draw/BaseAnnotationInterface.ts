import {
  SvgInterface as Svg,
  SvgElementInterface as SvgElement,
} from './SvgInterface';

export interface CircleBaseAnnotationSavableState {
  className: string;
  circleId: string;
}

export interface BaseAnnotationInterface {
  readonly type: string;
  readonly id: string;
  xCenter: number;
  yCenter: number;
  displacementLength: number;
  displacementAngle: number;
  
  shift(xShift: number, yShift: number): void;
  reposition(xBaseCenter: number, yBaseCenter: number): void;
  insertBefore(ele: SvgElement): void;
  insertAfter(ele: SvgElement): void;
  remove(): void;
  savableState(): object;
  refreshIds(): void;
}

export interface CircleBaseAnnotationInterface extends BaseAnnotationInterface {}

export default BaseAnnotationInterface;
