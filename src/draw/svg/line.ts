import * as SVG from '@svgdotjs/svg.js';

export class SVGLineWrapper {

  // the wrapped line
  readonly line: SVG.Line;

  constructor(line: SVG.Line) {
    this.line = line;
  }

  id(id?: string): unknown {
    if (typeof id == 'string') {
      this.line.id(id);
    } else {
      return this.line.id();
    }
  }

  get x1(): unknown {
    return this.line.attr('x1');
  }

  set x1(x1) {
    this.line.attr('x1', x1);
  }

  get y1(): unknown {
    return this.line.attr('y1');
  }

  set y1(y1) {
    this.line.attr('y1', y1);
  }

  get x2(): unknown {
    return this.line.attr('x2');
  }

  set x2(x2) {
    this.line.attr('x2', x2);
  }

  get y2(): unknown {
    return this.line.attr('y2');
  }

  set y2(y2) {
    this.line.attr('y2', y2);
  }

  get stroke(): unknown {
    return this.line.attr('stroke');
  }

  set stroke(s) {
    this.line.attr('stroke', s);
  }

  get strokeWidth(): unknown {
    return this.line.attr('stroke-width');
  }

  set strokeWidth(sw) {
    this.line.attr('stroke-width', sw);
  }

  get strokeOpacity(): unknown {
    return this.line.attr('stroke-opacity');
  }

  set strokeOpacity(so) {
    this.line.attr('stroke-opacity', so);
  }

  front() {
    this.line.front();
  }

  back() {
    this.line.back();
  }

  remove() {
    this.line.remove();
  }
}
