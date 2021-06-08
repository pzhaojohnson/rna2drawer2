import * as SVG from '@svgdotjs/svg.js';
import { SVGElementWrapper } from './element';

export class SVGTextWrapper extends SVGElementWrapper {

  // the wrapped text
  readonly element: SVG.Text;

  constructor(text: SVG.Text) {
    super(text);

    this.element = text;
  }

  text(text?: string): unknown {
    try {
      if (typeof text == 'string') {
        this.element.text(text);
      } else {
        return this.element.text();
      }
    } catch (error) {
      console.error(error);
    }
  }
}
