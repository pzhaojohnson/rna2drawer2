import { CircleBaseAnnotationInterface } from './CircleBaseAnnotationInterface';
import * as SVG from '@svgdotjs/svg.js';
import { Point2D as Point } from 'Math/Point';
import { SVGCircleWrapper as CircleWrapper } from 'Draw/svg/circle';
import { assignUuid } from 'Draw/svg/id';

export class CircleBaseAnnotation implements CircleBaseAnnotationInterface {
  readonly circle: SVG.Circle;

  _baseCenter: Point;

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

    this._baseCenter = { ...baseCenter };
  }

  get id(): string {
    return this.circle.id();
  }

  reposition(baseCenter?: Point) {
    this.circle.attr({
      'cx': baseCenter?.x ?? this._baseCenter.x,
      'cy': baseCenter?.y ?? this._baseCenter.y,
    });
    if (baseCenter) {
      this._baseCenter = { ...baseCenter };
    }
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
