import * as SVG from '@svgdotjs/svg.js';
import { SVGElementWrapper } from './element';

export class SVGCircleWrapper extends SVGElementWrapper {

  // the wrapped circle
  readonly element: SVG.Circle;

  constructor(circle: SVG.Circle) {
    super(circle);

    this.element = circle;
  }
}
