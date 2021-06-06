import * as SVG from '@svgdotjs/svg.js';

export class SVGTextWrapper {

  // the wrapped text
  readonly text: SVG.Text;

  constructor(text: SVG.Text) {
    this.text = text;
  }

  get x(): unknown {
    return this.text.attr('x');
  }

  set x(x) {
    this.text.attr('x', x);
  }

  get y(): unknown {
    return this.text.attr('y');
  }

  set y(y) {
    this.text.attr('y', y);
  }

  get fontFamily(): unknown {
    return this.text.attr('font-family');
  }

  set fontFamily(ff) {
    this.text.attr('font-family', ff);
  }

  get fontSize(): unknown {
    return this.text.attr('font-size');
  }

  set fontSize(fs) {
    this.text.attr('font-size', fs);
  }

  get fontWeight(): unknown {
    return this.text.attr('font-weight');
  }

  set fontWeight(fw) {
    this.text.attr('font-weight', fw);
  }

  get fontStyle(): unknown {
    return this.text.attr('font-style');
  }

  set fontStyle(fs) {
    this.text.attr('font-style', fs);
  }

  get fill(): unknown {
    return this.text.attr('fill');
  }

  set fill(f) {
    this.text.attr('fill', f);
  }

  get fillOpacity(): unknown {
    return this.text.attr('fill-opacity');
  }

  set fillOpacity(fo) {
    this.text.attr('fill-opacity', fo);
  }

  get cursor(): unknown {
    return this.text.css('cursor');
  }

  set cursor(c) {
    this.text.css('cursor', c);
  }

  id(id?: string): unknown {
    if (typeof id == 'string') {
      this.text.id(id);
    } else {
      return this.text.id();
    }
  }

  cx(cx?: number): unknown {
    if (typeof cx == 'number') {
      this.text.cx(cx);
    } else {
      return this.text.cx();
    }
  }

  cy(cy?: number): unknown {
    if (typeof cy == 'number') {
      this.text.cy(cy);
    } else {
      return this.text.cy();
    }
  }

  mouseover(f: () => void) {
    this.text.mouseover(f);
  }

  mouseout(f: () => void) {
    this.text.mouseout(f);
  }

  mousedown(f: () => void) {
    this.text.mousedown(f);
  }

  front() {
    this.text.front();
  }

  back() {
    this.text.back();
  }

  remove() {
    this.text.remove();
  }
}
