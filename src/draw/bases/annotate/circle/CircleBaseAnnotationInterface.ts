import * as SVG from '@svgdotjs/svg.js';

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

export interface CircleBaseAnnotationInterface {
  readonly circle: SVG.Circle;
  readonly id: string;
  reposition(xBaseCenter: number, yBaseCenter: number): void;
  bringToFront(): void;
  sendToBack(): void;
  pulsateBetween(pulsedProps: CircleBaseAnnotationPulsableProps, pulseProps?: PulseProps): void;
  refreshIds(): void;
}
