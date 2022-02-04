import { TertiaryBondInterface as TertiaryBond } from 'Draw/bonds/curved/TertiaryBondInterface';
import * as SVG from '@svgdotjs/svg.js';

export class TertiaryBondHighlighting {

  // the tertiary bond being highlighted
  readonly tertiaryBond: TertiaryBond;

  rect: SVG.Rect;

  constructor(tertiaryBond: TertiaryBond) {
    this.tertiaryBond = tertiaryBond;

    this.rect = new SVG.Rect();

    this.rect.attr({
      'stroke': 'blue',
      'stroke-width': 0.35,
      'stroke-dasharray': '1 1',
      'fill-opacity': 0,
    });
  }

  appendTo(ele: SVG.Element) {
    this.rect.addTo(ele);
  }

  remove() {
    this.rect.remove();
  }

  refit() {
    let bbox = this.tertiaryBond.path.bbox();
    this.rect.attr({
      'x': bbox.x,
      'y': bbox.y,
      'width': bbox.width,
      'height': bbox.height,
    });
  }
}
