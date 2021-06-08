import * as SVG from '@svgdotjs/svg.js';
import { SVGElementWrapper } from './element';

export class SVGTextWrapper extends SVGElementWrapper {

  // the wrapped text
  readonly element: SVG.Text;

  constructor(text: SVG.Text) {
    super(text);

    this.element = text;
  }

  get cursor(): unknown {
    return this.element.css('cursor');
  }

  set cursor(c) {
    this.element.css('cursor', c);
  }
}
