import * as SVG from '@svgdotjs/svg.js';
import { interpretNumber } from 'Draw/svg/interpretNumber';

/**
 * Returns the fill-opacity of the elements or undefined
 * for an empty array of elements or if not all elements
 * have the same fill-opacity.
 */
export function fillOpacity(eles: SVG.Element[]): number | undefined {
  if (eles.length == 0) {
    return undefined;
  }

  let values = new Set(
    eles.map(ele => (
      interpretNumber(ele.attr('fill-opacity'))?.valueOf()
    ))
  );

  if (values.size == 1) {
    return values.values().next().value;
  } else {
    return undefined;
  }
}

/**
 * Sets the fill-opacity of each element to the given value.
 *
 * Does nothing if the given value is nonfinite.
 *
 * Negative values are clamped to zero, and values above one are clamped
 * to one.
 */
export function setFillOpacity(eles: SVG.Element[], value: number) {
  if (!Number.isFinite(value)) {
    return;
  }

  if (value < 0) {
    value = 0;
  } else if (value > 1) {
    value = 1;
  }

  eles.forEach(ele => {
    ele.attr('fill-opacity', value);
  });
}
