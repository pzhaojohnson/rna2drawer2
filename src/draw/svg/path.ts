import * as SVG from '@svgdotjs/svg.js';

export class SVGPathWrapper {

  // the wrapped path
  readonly path: SVG.Path;

  constructor(path: SVG.Path) {
    this.path = path;
  }

  id(id?: string): unknown {
    if (typeof id == 'string') {
      this.path.id(id);
    } else {
      return this.path.id();
    }
  }

  get d(): unknown {
    return this.path.attr('d');
  }

  set d(d) {
    this.path.attr('d', d);
  }

  get stroke(): unknown {
    return this.path.attr('stroke');
  }

  set stroke(s) {
    this.path.attr('stroke', s);
  }

  get strokeWidth(): unknown {
    return this.path.attr('stroke-width');
  }

  set strokeWidth(sw) {
    this.path.attr('stroke-width', sw);
  }

  get strokeDasharray(): unknown {
    return this.path.attr('stroke-dasharray');
  }

  set strokeDasharray(sd) {
    this.path.attr('stroke-dasharray', sd);
  }

  get fill(): unknown {
    return this.path.attr('fill');
  }

  set fill(f) {
    this.path.attr('fill', f);
  }

  get fillOpacity(): unknown {
    return this.path.attr('fill-opacity');
  }

  set fillOpacity(fo) {
    this.path.attr('fill-opacity', fo);
  }

  get cursor(): unknown {
    return this.path.css('cursor');
  }

  set cursor(c) {
    this.path.css('cursor', c);
  }

  front() {
    this.path.front();
  }

  back() {
    this.path.back();
  }

  remove() {
    this.path.remove();
  }

  mouseover(f: () => void) {
    this.path.mouseover(f);
  }

  mouseout(f: () => void) {
    this.path.mouseout(f);
  }

  mousedown(f: () => void) {
    this.path.mousedown(f);
  }

  dblclick(f: () => void) {
    this.path.dblclick(f);
  }
}
