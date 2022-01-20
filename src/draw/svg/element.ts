import * as SVG from '@svgdotjs/svg.js';

export class SVGElementWrapper {

  // the wrapped element
  readonly wrapped: SVG.Element;

  constructor(element: SVG.Element) {
    this.wrapped = element;
  }

  root(): unknown {
    return this.wrapped.root();
  }

  attr(arg?: string | { [key: string]: unknown }): unknown {
    if (typeof arg == 'string') {
      return this.wrapped.attr(arg);
    } else if (typeof arg == 'object') {
      this.wrapped.attr(arg);
    } else {
      return this.wrapped.attr();
    }
  }

  css(arg?: string | CSSStyleDeclaration): unknown {
    if (typeof arg == 'string') {
      return this.wrapped.css(arg);
    } else if (typeof arg == 'object') {
      this.wrapped.css(arg);
    } else {
      return this.wrapped.css();
    }
  }

  id(id?: string): unknown {
    if (typeof id == 'string') {
      this.wrapped.id(id);
    } else {
      return this.wrapped.id();
    }
  }

  cx(cx?: number): unknown {
    if (typeof cx == 'number') {
      this.wrapped.cx(cx);
    } else {
      return this.wrapped.cx();
    }
  }

  cy(cy?: number): unknown {
    if (typeof cy == 'number') {
      this.wrapped.cy(cy);
    } else {
      return this.wrapped.cy();
    }
  }

  front() {
    this.wrapped.front();
  }

  back() {
    this.wrapped.back();
  }

  position(): unknown {
    return this.wrapped.position();
  }

  remove() {
    this.wrapped.remove();
  }

  svg(): unknown {
    return this.wrapped.svg();
  }
}
