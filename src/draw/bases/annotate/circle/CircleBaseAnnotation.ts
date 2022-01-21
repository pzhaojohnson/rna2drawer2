import {
  CircleBaseAnnotationInterface,
  Repositioning,
} from './CircleBaseAnnotationInterface';
import { SVGCircleWrapper as Circle } from 'Draw/svg/SVGCircleWrapper';
import { Point2D as Point } from 'Math/points/Point';
import { assignUuid } from 'Draw/svg/assignUuid';
import { Values } from './values';

export class CircleBaseAnnotation implements CircleBaseAnnotationInterface {
  static recommendedDefaults: Values = {
    circle: {
      'r': 7,
      'stroke': '#00ffff',
      'stroke-width': 1,
      'stroke-opacity': 1,
      'fill': '#c3ffff',
      'fill-opacity': 1,
    },
  };

  readonly circle: Circle;

  _baseCenter: Point;

  constructor(circle: Circle, baseCenter: Point) {
    if (circle.wrapped.type != 'circle') {
      throw new Error("Wrapped element isn't a circle.");
    }

    this.circle = circle;

    // use the attr method to check if an ID is initialized
    // since the id method itself will initialize an ID (to
    // a non-UUID)
    if (!this.circle.attr('id')) {
      assignUuid(this.circle);
    }

    this._baseCenter = { ...baseCenter };
  }

  get id(): string {
    return String(this.circle.id());
  }

  reposition(rp?: Repositioning) {
    this.circle.attr({
      'cx': rp?.baseCenter?.x ?? this._baseCenter.x,
      'cy': rp?.baseCenter?.y ?? this._baseCenter.y,
    });
    if (rp?.baseCenter) {
      this._baseCenter = { ...rp.baseCenter };
    }
  }
}
