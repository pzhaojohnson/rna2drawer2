import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import * as SVG from '@svgdotjs/svg.js';

export type Options = {

  // the bases to trace
  // (bases will be traced in the order that they are present in the array)
  // (should contain at least two bases)
  readonly bases: Base[];

  // when true the trace will continue from the last base to the first base
  // to form a cycle (and close the underlying path element)
  close: boolean;
};

export class BasesTrace {
  readonly options: Options;

  // the underlying path element of the trace
  readonly path: SVG.Path;

  constructor(options: Options) {
    this.options = options;

    this.path = new SVG.Path();

    this.path.attr({
      'stroke': '#AAFBFF',
      'stroke-width': 13.5,
      'stroke-opacity': 1,
      'stroke-linejoin': 'round',
      'fill': '#AAFBFF',
      'fill-opacity': 1,
    });

    this.retrace();
  }

  appendTo(svg: SVG.Svg) {
    this.path.addTo(svg);
  }

  remove() {
    this.path.remove();
  }

  retrace() {
    if (this.options.bases.length == 0) {
      console.error('The provided array of bases to trace is empty.');
      return;
    }

    let d = '';
    let baseCenters = this.options.bases.map(b => ({ x: b.xCenter, y: b.yCenter }));

    let c1 = baseCenters[0];
    d += `M ${c1.x} ${c1.y}`;

    for (let i = 1; i < baseCenters.length; i++) {
      let ci = baseCenters[i];
      d += `L ${ci.x} ${ci.y}`;
    }

    if (this.options.close && baseCenters.length > 1) {
      d += 'z';
    }

    this.path.plot(d);
  }
}
