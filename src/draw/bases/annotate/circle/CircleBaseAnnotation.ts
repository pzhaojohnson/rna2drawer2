import { CircleBaseAnnotationInterface } from './CircleBaseAnnotationInterface';
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

  refreshIds() {
    assignUuid(new CircleWrapper(this.circle));
  }
}
