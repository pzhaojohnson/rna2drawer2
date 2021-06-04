import * as SVG from '@svgdotjs/svg.js';

export class SVGCircleWrapper {

  // the wrapped circle
  readonly circle: SVG.Circle;

  constructor(circle: SVG.Circle) {
    this.circle = circle;
  }

  id(id?: string): unknown {
    if (typeof id == 'string') {
      return this.circle.id(id);
    } else {
      return this.circle.id();
    }
  }

  get r(): unknown {
    return this.circle.attr('r');
  }

  set r(r) {
    this.circle.attr('r', r);
  }

  get cx(): unknown {
    return this.circle.attr('cx');
  }

  set cx(cx) {
    this.circle.attr('cx', cx);
  }

  get cy(): unknown {
    return this.circle.attr('cy');
  }

  set cy(cy) {
    this.circle.attr('cy', cy);
  }

  get stroke(): unknown {
    return this.circle.attr('stroke');
  }

  set stroke(s) {
    this.circle.attr('stroke', s);
  }

  get strokeWidth(): unknown {
    return this.circle.attr('stroke-width');
  }

  set strokeWidth(sw) {
    this.circle.attr('stroke-width', sw);
  }

  get strokeOpacity(): unknown {
    return this.circle.attr('stroke-opacity');
  }

  set strokeOpacity(so) {
    this.circle.attr('stroke-opacity', so);
  }

  get fill(): unknown {
    return this.circle.attr('fill');
  }

  set fill(f) {
    this.circle.attr('fill', f);
  }

  get fillOpacity(): unknown {
    return this.circle.attr('fill-opacity');
  }

  set fillOpacity(fo) {
    this.circle.attr('fill-opacity', fo);
  }

  front() {
    this.circle.front();
  }

  back() {
    this.circle.back();
  }

  remove() {
    this.circle.remove();
  }
}
