import { Side } from './Side';
import { BasesTrace } from 'Draw/interact/highlight/BasesTrace';

import * as SVG from '@svgdotjs/svg.js';

export type SideHighlightingType = (
  'selected'
  | 'bindable'
  | 'unbindable'
);

export type Options = {

  // the side to highlight
  side: Side;

  // the type of side
  type: SideHighlightingType;

  // whether the side is hovered
  isHovered?: boolean;
};

const outlineTraceStrokes = {
  'selected': '#f3e500',
  'bindable': '#d43dff',
  'unbindable': '#ff0e0e',
};

const fillTraceStrokes = {
  'selected': '#fff785',
  'bindable': '#f9e4ff',
  'unbindable': '#ffdddd',
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

    let strokeOpacity = 1;
    if (options.type == 'bindable' && !options.isHovered) {
      strokeOpacity = 0.5;
    }

    this.outlineTrace = new BasesTrace({ bases, close: false });
    this.outlineTrace.path.attr({
      'stroke': outlineTraceStrokes[options.type],
      'stroke-width': 18,
      'stroke-opacity': strokeOpacity,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'fill-opacity': 0,
    });

    this.fillTrace = new BasesTrace({ bases, close: false });
    this.fillTrace.path.attr({
      'stroke': fillTraceStrokes[options.type],
      'stroke-width': 14,
      'stroke-opacity': strokeOpacity,
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
