import * as Svg from '@svgdotjs/svg.js';

export interface CircleBaseAnnotationSavableState {
  className: string;
  circleId: string;
}

export interface PulsableProps {
  radius?: number;
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
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
  insertBefore(ele: Svg.Element): void;
  insertAfter(ele: Svg.Element): void;
  pulsateBetween(props: PulsableProps): void;
  remove(): void;
  savableState(): object;
  refreshIds(): void;
}

export interface CircleBaseAnnotationInterface extends BaseAnnotationInterface {
  radius: number;
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeWidth: number;
  strokeOpacity: number;
}

export default BaseAnnotationInterface;
