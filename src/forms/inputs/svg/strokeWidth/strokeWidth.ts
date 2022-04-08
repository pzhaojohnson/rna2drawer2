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
 * Sets the stroke-width of each element to the given value.
 *
 * Does nothing if the given value is nonfinite.
 *
 * Clamps negative values to zero.
 */
export function setStrokeWidth(eles: SVG.Element[], value: number) {
  if (!Number.isFinite(value)) {
    return;
  }

  if (value < 0) {
    value = 0;
  }

  eles.forEach(ele => {
    ele.attr('stroke-width', value);
  });
}
