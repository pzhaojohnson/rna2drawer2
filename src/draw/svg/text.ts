import * as SVG from '@svgdotjs/svg.js';
import { SVGElementWrapper } from './element';

export class SVGTextWrapper extends SVGElementWrapper {

  // the wrapped text
  readonly wrapped: SVG.Text;

  constructor(text: SVG.Text) {
    super(text);

    this.wrapped = text;
  }

  text(s?: string): string | undefined {
    try {
      if (typeof s == 'string') {
        this.wrapped.text(s);
      } else {
        let text = this.wrapped.text();
        return typeof text == 'string' ? text : undefined;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
