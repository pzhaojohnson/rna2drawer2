import * as SVG from '@svgdotjs/svg.js';
import { SVGElementWrapper } from 'Draw/svg/SVGElementWrapper';

export class SVGLineWrapper extends SVGElementWrapper {

  // the wrapped line
  readonly wrapped: SVG.Line;

  constructor(line: SVG.Line) {
    super(line);

    this.wrapped = line;
  }
}
