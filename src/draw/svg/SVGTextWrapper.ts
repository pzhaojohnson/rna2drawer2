import * as SVG from '@svgdotjs/svg.js';
import { SVGElementWrapper } from 'Draw/svg/SVGElementWrapper';

// the primary purpose of this wrapper class is to convert the return types
// of forwarded methods and getters to unknown (since the SVG.js library
// uses a lot of any types)
export class SVGTextWrapper extends SVGElementWrapper<SVG.Text> {
  text(text?: string): unknown {
    if (typeof text == 'string') {
      return this.wrapped.text(text);
    } else {
      return this.wrapped.text();
    }
  }
}
