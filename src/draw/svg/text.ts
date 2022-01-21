import * as SVG from '@svgdotjs/svg.js';
import { SVGElementWrapper } from './element';

// the primary purpose of this wrapper class is to convert the return types
// of forwarded methods and getters to unknown (since the SVG.js library
// uses a lot of any types)
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
