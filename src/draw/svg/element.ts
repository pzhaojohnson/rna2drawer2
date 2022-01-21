import * as SVG from '@svgdotjs/svg.js';

// the primary purpose of this wrapper class is to convert the return types
// of forwarded methods and getters to unknown (since the SVG.js library
// uses a lot of any types)
export class SVGElementWrapper {

  // the wrapped element
  readonly wrapped: SVG.Element;

  constructor(element: SVG.Element) {
    this.wrapped = element;
  }

  root(): unknown {
    return this.wrapped.root();
  }

  attr(): unknown;
  attr(name: string, value?: unknown): unknown;
  attr(obj: object): unknown;
  attr(...args: unknown[]): unknown {
    if (args.length == 0) {
      return this.wrapped.attr();
    } else if (typeof args[0] == 'string' && args.length == 1) {
      return this.wrapped.attr(args[0]);
    } else if (typeof args[0] == 'string' && args.length == 2) {
      return this.wrapped.attr(args[0], args[1]);
    } else if (typeof args[0] == 'object' && args[0] != null) {
      return this.wrapped.attr(args[0]);
    }
  }

  css(name: string): unknown;
  css(style: Partial<CSSStyleDeclaration>): unknown;
  css(...args: unknown[]): unknown {
    if (typeof args[0] == 'string') {
      return this.wrapped.css(args[0]);
    } else if (typeof args[0] == 'object' && args[0] != null) {
      return this.wrapped.css(args[0]);
    }
  }

  id(id?: string): unknown {
    if (typeof id == 'string') {
      return this.wrapped.id(id);
    } else {
      return this.wrapped.id();
    }
  }

  cx(cx?: number): unknown {
    if (typeof cx == 'number') {
      return this.wrapped.cx(cx);
    } else {
      return this.wrapped.cx();
    }
  }

  cy(cy?: number): unknown {
    if (typeof cy == 'number') {
      return this.wrapped.cy(cy);
    } else {
      return this.wrapped.cy();
    }
  }

  front(): unknown {
    return this.wrapped.front();
  }

  back(): unknown {
    return this.wrapped.back();
  }

  position(): unknown {
    return this.wrapped.position();
  }

  remove(): unknown {
    return this.wrapped.remove();
  }

  svg(): unknown {
    return this.wrapped.svg();
  }
}
