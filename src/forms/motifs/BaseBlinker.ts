import { BaseInterface as Base } from 'Draw/bases/BaseInterface';

import * as SVG from '@svgdotjs/svg.js';
import { interpretColor } from 'Draw/svg/interpretColor';

const whiteHex = '#ffffff';
const blackHex = '#000000';

export type BlinkOptions = {

  // whether to remove the blinker when blinking ends
  remove?: boolean;
};

export class BaseBlinker {

  // the base to blink
  readonly base: Base;

  // to be overlaid over the text element of the base
  readonly textOverlay: SVG.Text;

  constructor(base: Base) {
    this.base = base;

    this.textOverlay = new SVG.Text();
  }

  appendTo(svg: SVG.Svg) {
    this.textOverlay.addTo(svg);
  }

  remove() {
    this.textOverlay.remove();
  }

  blink(options?: BlinkOptions) {

    // give same appearance as the base text element
    this.textOverlay.attr(this.base.text.attr());
    this.textOverlay.text(this.base.text.text());

    let fill: unknown = this.base.text.attr('fill');
    let fillColor = interpretColor(fill);
    let blinkedFill = whiteHex;
    if (fillColor) {
      // white if fill is closer to black and black otherwise
      blinkedFill = fillColor.hsl().l < 50 ? whiteHex : blackHex;
    }

    let numBlinks = 6;
    let blinkDuration = 500;

    this.textOverlay
      .animate(blinkDuration / 2)
      .attr({ 'fill': blinkedFill })
      .loop(2 * numBlinks, true);

    if (options?.remove) {
      setTimeout(() => this.remove(), numBlinks * blinkDuration);
    }
  }
}
