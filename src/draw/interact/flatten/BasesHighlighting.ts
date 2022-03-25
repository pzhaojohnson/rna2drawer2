import type { Base } from 'Draw/bases/Base';
import { BasesTrace } from 'Draw/interact/highlight/BasesTrace';
import * as SVG from '@svgdotjs/svg.js';
import { interpretNumber } from 'Draw/svg/interpretNumber';

// returns the maximum font size that any of the text elements has
function maxFontSize(texts: SVG.Text[]): number {
  let fontSizes: number[] = [];
  texts.forEach(t => {
    let n = interpretNumber(t.attr('font-size'));
    if (n) {
      fontSizes.push(n.valueOf());
    }
  });
  return Math.max(...fontSizes);
}

export type Options = {

  // the bases to highlight
  // (should be in ascending order by base position in the layout sequence
  // and should contain at least two bases)
  readonly bases: Base[];
};

export class BasesHighlighting {
  readonly options: Options;

  readonly borderTrace: BasesTrace;
  readonly fillTrace: BasesTrace;

  constructor(options: Options) {
    this.options = options;

    this.borderTrace = new BasesTrace({ bases: options.bases, close: true });
    this.fillTrace = new BasesTrace({ bases: options.bases, close: true });

    this.borderTrace.path.attr({
      'stroke': '#344FFF',
      'stroke-opacity': 1,
      'stroke-linejoin': 'round',
      'fill': '#344FFF',
      'fill-opacity': 1,
    });

    this.fillTrace.path.attr({
      'stroke': '#AAFBFF',
      'stroke-opacity': 1,
      'stroke-linejoin': 'round',
      'fill': '#AAFBFF',
      'fill-opacity': 1,
    });

    this.refit();
  }

  appendTo(svg: SVG.Svg) {
    this.borderTrace.appendTo(svg);
    this.fillTrace.appendTo(svg);
  }

  remove() {
    this.fillTrace.remove();
    this.borderTrace.remove();
  }

  refit() {
    let fs = maxFontSize(this.options.bases.map(b => b.text));
    if (!Number.isFinite(fs) || fs < 1) {
      fs = 1; // guarantee to be finite and at least one
    }
    this.borderTrace.path.attr('stroke-width', 2 * fs);
    this.fillTrace.path.attr('stroke-width', 1.5 * fs);

    this.borderTrace.retrace();
    this.fillTrace.retrace();
  }
}
