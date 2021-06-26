import * as SVG from '@svgdotjs/svg.js';

export interface BaseAnnotationInterface {
  readonly id: string;
  
  reposition(xBaseCenter: number, yBaseCenter: number): void;
  bringToFront(): void;
  sendToBack(): void;
  remove(): void;
  refreshIds(): void;
}

export interface CircleBaseAnnotationPulsableProps {
  radius?: number;
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
}

export interface PulseProps {
  duration?: number;
}

export interface CircleBaseAnnotationInterface extends BaseAnnotationInterface {
  readonly circle: SVG.Circle;
  pulsateBetween(pulsedProps: CircleBaseAnnotationPulsableProps, pulseProps?: PulseProps): void;
}

export default BaseAnnotationInterface;
