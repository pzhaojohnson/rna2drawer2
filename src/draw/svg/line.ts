import * as SVG from '@svgdotjs/svg.js';
import { SVGElementWrapper } from './element';

export class SVGLineWrapper extends SVGElementWrapper {

  // the wrapped line
  readonly element: SVG.Line;

  constructor(line: SVG.Line) {
    super(line);

    this.element = line;
  }
}
