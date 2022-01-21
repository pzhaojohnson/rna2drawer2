import * as SVG from '@svgdotjs/svg.js';
import { SVGElementWrapper } from './element';

export class SVGTextWrapper extends SVGElementWrapper {

  // the wrapped text
  readonly wrapped: SVG.Text;

  constructor(text: SVG.Text) {
    super(text);

    this.wrapped = text;
  }

  text(text?: string): unknown {
    if (typeof text == 'string') {
      return this.wrapped.text(text);
    } else {
      return this.wrapped.text();
    }
  }
}
