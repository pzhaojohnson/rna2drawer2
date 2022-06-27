import * as SVG from '@svgdotjs/svg.js';
import { interpretColorValue } from 'Draw/svg/interpretColorValue';
import { ColorsWrapper } from 'Values/svg/ColorsWrapper';

export class ColorValuesWrapper {
  readonly values: unknown[];

  constructor(values: unknown[]) {
    this.values = values;
  }

  /**
   * If all color values specify the same color,
   * returns an SVG.Color instance of that color.
   * Returns undefined otherwise.
   *
   * Returns undefined for an empty array of color values
   * or if any color values cannot be interpreted.
   */
  get commonValue(): SVG.Color | undefined {
    let colors = new ColorsWrapper(
      this.values.map(v => interpretColorValue(v))
    );

    return colors.commonValue;
  }
}
