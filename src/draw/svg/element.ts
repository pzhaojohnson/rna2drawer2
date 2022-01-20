import * as SVG from '@svgdotjs/svg.js';

export class SVGElementWrapper {

  // the wrapped element
  readonly wrapped: SVG.Element;

  constructor(element: SVG.Element) {
    this.wrapped = element;
  }

  root(): unknown {
    try {
      return this.wrapped.root();
    } catch (error) {
      console.error(error);
    }
  }

  attr(arg?: string | { [key: string]: unknown }): unknown {
    try {
      if (typeof arg == 'string') {
        return this.wrapped.attr(arg);
      } else if (typeof arg == 'object') {
        this.wrapped.attr(arg);
      } else {
        return this.wrapped.attr();
      }
    } catch (error) {
      console.error(error);
    }
  }

  css(arg?: string | CSSStyleDeclaration): unknown {
    try {
      if (typeof arg == 'string') {
        return this.wrapped.css(arg);
      } else if (typeof arg == 'object') {
        this.wrapped.css(arg);
      } else {
        return this.wrapped.css();
      }
    } catch (error) {
      console.error(error);
    }
  }

  id(id?: string): unknown {
    try {
      if (typeof id == 'string') {
        this.wrapped.id(id);
      } else {
        return this.wrapped.id();
      }
    } catch (error) {
      console.error(error);
    }
  }

  cx(cx?: number): unknown {
    try {
      if (typeof cx == 'number') {
        this.wrapped.cx(cx);
      } else {
        return this.wrapped.cx();
      }
    } catch (error) {
      console.error(error);
    }
  }

  cy(cy?: number): unknown {
    try {
      if (typeof cy == 'number') {
        this.wrapped.cy(cy);
      } else {
        return this.wrapped.cy();
      }
    } catch (error) {
      console.error(error);
    }
  }

  front() {
    try {
      this.wrapped.front();
    } catch (error) {
      console.error(error);
    }
  }

  back() {
    try {
      this.wrapped.back();
    } catch (error) {
      console.error(error);
    }
  }

  position(): unknown {
    try {
      return this.wrapped.position();
    } catch (error) {
      console.error(error);
    }
  }

  remove() {
    try {
      this.wrapped.remove();
    } catch (error) {
      console.error(error);
    }
  }

  svg(): unknown {
    try {
      return this.wrapped.svg();
    } catch (error) {
      console.error(error);
    }
  }
}
