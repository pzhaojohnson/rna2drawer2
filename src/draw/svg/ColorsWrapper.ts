import * as SVG from '@svgdotjs/svg.js';
import { interpretColorValue } from 'Draw/svg/interpretColorValue';

export type Nullish = null | undefined;

export function isSVGColor(v: unknown): v is SVG.Color {
  return v instanceof SVG.Color;
}

export class ColorsWrapper {
  readonly colors: (SVG.Color | Nullish)[];

  constructor(colors: (SVG.Color | Nullish)[]) {
    this.colors = colors;
  }

  /**
   * If all colors have the same value, returns an SVG.Color instance
   * possessing that value. Returns undefined otherwise.
   *
   * Returns undefined for an empty array of colors and if any values
   * in the array of colors are null or undefined.
   */
  get commonValue(): SVG.Color | undefined {
    let colors = this.colors.filter(isSVGColor);

    // some values of null or undefined are present
    if (colors.length < this.colors.length) {
      return undefined;
    }

    let hexs = new Set(
      colors.map(c => c.toHex().toLowerCase())
    );

    if (hexs.size != 1) {
      return undefined;
    }

    let hex: string = hexs.values().next().value;
    return interpretColorValue(hex); // convert back to an SVG.Color instance
  }
}
