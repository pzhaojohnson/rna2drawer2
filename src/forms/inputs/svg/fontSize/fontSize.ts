import * as SVG from '@svgdotjs/svg.js';
import { interpretNumber } from 'Draw/svg/interpretNumber';

/**
 * Returns the font-size of the elements.
 *
 * Returns undefined:
 *  1) for an empty array of elements or
 *  2) if not all elements have the same font-size.
 */
export function fontSize(eles: SVG.Element[]): number | undefined {
  if (eles.length == 0) {
    return undefined;
  }

  let values = new Set(
    eles.map(ele => (
      interpretNumber(ele.attr('font-size'))?.valueOf()
    ))
  );

  if (values.size == 1) {
    return values.values().next().value;
  } else {
    return undefined;
  }
}

/**
 * Sets the font-size of each element to the given value.
 *
 * Does nothing if the given value is nonfinite.
 *
 * Clamps values less than one to one.
 */
export function setFontSize(eles: SVG.Element[], value: number) {
  if (!Number.isFinite(value)) {
    return;
  }

  if (value < 1) {
    value = 1;
  }

  eles.forEach(ele => {
    ele.attr('font-size', value);
  });
}
