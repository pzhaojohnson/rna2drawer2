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
    try {
      if (typeof text == 'string') {
        this.wrapped.text(text);
      } else {
        return this.wrapped.text();
      }
    } catch (error) {
      console.error(error);
    }
  }
}
