import * as SVG from '@svgdotjs/svg.js';
import { SVGElementWrapper } from './element';

export class SVGLineWrapper extends SVGElementWrapper {

  // the wrapped line
  readonly wrapped: SVG.Line;

  constructor(line: SVG.Line) {
    super(line);

    this.wrapped = line;
  }
}
