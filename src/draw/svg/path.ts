import * as SVG from '@svgdotjs/svg.js';
import { SVGElementWrapper } from './element';

export class SVGPathWrapper extends SVGElementWrapper {

  // the wrapped path
  readonly wrapped: SVG.Path;

  constructor(path: SVG.Path) {
    super(path);
    
    this.wrapped = path;
  }
}
