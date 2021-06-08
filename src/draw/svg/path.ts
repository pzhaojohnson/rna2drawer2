import * as SVG from '@svgdotjs/svg.js';
import { SVGElementWrapper } from './element';

export class SVGPathWrapper extends SVGElementWrapper {

  // the wrapped path
  readonly element: SVG.Path;

  constructor(path: SVG.Path) {
    super(path);
    
    this.element = path;
  }
}
