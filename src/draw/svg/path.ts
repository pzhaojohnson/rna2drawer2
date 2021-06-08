import * as SVG from '@svgdotjs/svg.js';
import { SVGElementWrapper } from './element';

export class SVGPathWrapper extends SVGElementWrapper {

  // the wrapped path
  readonly element: SVG.Path;

  constructor(path: SVG.Path) {
    super(path);
    
    this.element = path;
  }

  get cursor(): unknown {
    return this.element.css('cursor');
  }

  set cursor(c) {
    this.element.css('cursor', c);
  }
}
