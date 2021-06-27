import {
  CircleBaseAnnotationInterface,
  CircleBaseAnnotationPulsableProps,
  PulseProps,
} from './CircleBaseAnnotationInterface';
import * as SVG from '@svgdotjs/svg.js';
import { SVGCircleWrapper as CircleWrapper } from 'Draw/svg/circle';
import { assignUuid } from 'Draw/svg/id';

export class CircleBaseAnnotation implements CircleBaseAnnotationInterface {
  readonly circle: SVG.Circle;

  constructor(circle: SVG.Circle, xBaseCenter: number, yBaseCenter: number) {
    if (circle.type != 'circle') {
      throw new Error('Passed element is not a circle.');
    }

    this.circle = circle;

    // use the attr method to check if an ID is initialized
    // since the id method itself will initialize an ID (to
    // a non-UUID)
    if (!this.circle.attr('id')) {
      assignUuid(new CircleWrapper(this.circle));
    }
  }

  get id(): string {
    return this.circle.id();
  }

  reposition(xBaseCenter: number, yBaseCenter: number) {
    this.circle.attr({
      'cx': xBaseCenter,
      'cy': yBaseCenter,
    });
  }

  bringToFront() {
    this.circle.front();
  }

  sendToBack() {
    this.circle.back();
  }

  pulsateBetween(pulsedProps: CircleBaseAnnotationPulsableProps, pulseProps?: PulseProps) {
    let withoutFill = {
      'r': pulsedProps.radius ?? this.circle.attr('r'),
      'fill-opacity': pulsedProps.fillOpacity ?? this.circle.attr('fill-opacity'),
      'stroke': pulsedProps.stroke ?? this.circle.attr('stroke'),
      'stroke-width': pulsedProps.strokeWidth ?? this.circle.attr('stroke-width'),
      'stroke-opacity': pulsedProps.strokeOpacity ?? this.circle.attr('stroke-opacity'),
    };
    let fill = pulsedProps.fill ?? this.circle.attr('fill');
    let withFill = fill == 'none' ? {} : { 'fill': fill };
    let attrs = { ...withoutFill, ...withFill };
    let duration = pulseProps?.duration ?? 2000;
    this.circle.animate(duration).attr(attrs).loop(undefined, true);
  }

  refreshIds() {
    assignUuid(new CircleWrapper(this.circle));
  }
}
