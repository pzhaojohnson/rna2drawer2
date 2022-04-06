import * as SVG from '@svgdotjs/svg.js';
import { interpretNumber } from 'Draw/svg/interpretNumber';

/**
 * Returns the stroke-width of the elements and undefined
 * for an empty array of elements or if not all of the elements
 * have the same stroke-width.
 */
export function strokeWidth(eles: SVG.Element[]): number | undefined {
  if (eles.length == 0) {
    return undefined;
  }

  let values = new Set(
    eles.map(ele => (
      interpretNumber(ele.attr('stroke-width'))?.valueOf()
    ))
  );

  if (values.size == 1) {
    return values.values().next().value;
  } else {
    return undefined;
  }
}

/**
 * Sets the stroke-width of each element to the number parsed from
 * the string produced by converting the given value to a string.
 *
 * Does nothing if the number parsed is nonfinite.
 *
 * Clamps negative values to zero.
 */
export function setStrokeWidth(eles: SVG.Element[], value: unknown) {
  let n = Number.parseFloat(String(value));
  if (!Number.isFinite(n)) {
    return;
  }

  if (n < 0) {
    n = 0;
  }

  eles.forEach(ele => {
    ele.attr('stroke-width', n);
  });
}
