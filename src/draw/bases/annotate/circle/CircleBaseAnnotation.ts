import { CircleBaseAnnotationInterface } from './CircleBaseAnnotationInterface';
import * as SVG from '@svgdotjs/svg.js';
import { Point2D as Point } from 'Math/Point';
import { SVGCircleWrapper as CircleWrapper } from 'Draw/svg/circle';
import { assignUuid } from 'Draw/svg/id';

export class CircleBaseAnnotation implements CircleBaseAnnotationInterface {
  readonly circle: SVG.Circle;

  constructor(circle: SVG.Circle, baseCenter: Point) {
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

  reposition(baseCenter: Point) {
    this.circle.attr({
      'cx': baseCenter.x,
      'cy': baseCenter.y,
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
