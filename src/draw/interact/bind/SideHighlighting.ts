import { Side } from './Side';
import { BasesTrace } from 'Draw/interact/highlight/BasesTrace';

import * as SVG from '@svgdotjs/svg.js';

export type SideHighlightingType = (
  'selected'
  | 'bindable'
  | 'complementary'
  | 'unbindable'
);

export type Options = {

  // the side to highlight
  side: Side;

  // the type of side
  type: SideHighlightingType;

  // the width of the side highlighting
  width: number;
};

const outlineTraceStrokes = {
  'selected': '#edd800',
  'bindable': '#c000e9',
  'complementary': '#f0afff',
  'unbindable': '#e40d0d',
};

const fillTraceStrokes = {
  'selected': '#fff97c',
  'bindable': '#f7cfff',
  'complementary': '#ffecff',
  'unbindable': '#ffd1d1',
};

export class SideHighlighting {
  readonly options: Options;

  readonly outlineTrace: BasesTrace;
  readonly fillTrace: BasesTrace;

  constructor(options: Options) {
    this.options = options;

    let bases = options.side;
    if (bases.length == 1) {
      // duplicate so that at least the caps of traces appear
      bases.push(bases[0]);
    }

    this.outlineTrace = new BasesTrace({ bases, close: false });
    this.outlineTrace.path.attr({
      'stroke': outlineTraceStrokes[options.type],
      'stroke-width': options.width,
      'stroke-opacity': 1,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'fill-opacity': 0,
    });

    this.fillTrace = new BasesTrace({ bases, close: false });
    this.fillTrace.path.attr({
      'stroke': fillTraceStrokes[options.type],
      'stroke-width': 0.8 * options.width,
      'stroke-opacity': 1,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'fill-opacity': 0,
    });

    this.outlineTrace.retrace();
    this.fillTrace.retrace();
  }

  appendTo(svg: SVG.Svg) {
    this.outlineTrace.appendTo(svg);
    this.fillTrace.appendTo(svg);
  }

  remove() {
    this.fillTrace.remove();
    this.outlineTrace.remove();
  }
}
