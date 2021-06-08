import * as SVG from '@svgdotjs/svg.js';

export class SVGElementWrapper {

  // the wrapped element
  readonly element: SVG.Element;

  constructor(element: SVG.Element) {
    this.element = element;
  }

  attr(arg?: string | { [key: string]: unknown }): unknown {
    try {
      if (typeof arg == 'string') {
        return this.element.attr(arg);
      } else if (typeof arg == 'object') {
        this.element.attr(arg);
      } else {
        return this.element.attr();
      }
    } catch (error) {
      console.error(error);
    }
  }

  id(id?: string): unknown {
    try {
      if (typeof id == 'string') {
        this.element.id(id);
      } else {
        return this.element.id();
      }
    } catch (error) {
      console.error(error);
    }
  }

  cx(cx?: number): unknown {
    try {
      if (typeof cx == 'number') {
        this.element.cx(cx);
      } else {
        return this.element.cx();
      }
    } catch (error) {
      console.error(error);
    }
  }

  cy(cy?: number): unknown {
    try {
      if (typeof cy == 'number') {
        this.element.cy(cy);
      } else {
        return this.element.cy();
      }
    } catch (error) {
      console.error(error);
    }
  }

  mouseover(f: () => void) {
    try {
      this.element.mouseover(f);
    } catch (error) {
      console.error(error);
    }
  }

  mouseout(f: () => void) {
    try {
      this.element.mouseout(f);
    } catch (error) {
      console.error(error);
    }
  }

  mousedown(f: () => void) {
    try {
      this.element.mousedown(f);
    } catch (error) {
      console.error(error);
    }
  }

  dblclick(f: () => void) {
    try {
      this.element.dblclick(f);
    } catch (error) {
      console.error(error);
    }
  }

  front() {
    try {
      this.element.front();
    } catch (error) {
      console.error(error);
    }
  }

  back() {
    try {
      this.element.back();
    } catch (error) {
      console.error(error);
    }
  }

  remove() {
    try {
      this.element.remove();
    } catch (error) {
      console.error(error);
    }
  }
}
