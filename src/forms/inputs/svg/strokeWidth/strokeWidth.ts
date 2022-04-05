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
 * Sets the stroke-width of all elements to the number interpreted
 * from the given value.
 *
 * Does nothing if the given value cannot be interpreted as a number.
 *
 * If the given value is negative, sets the stroke-width of all
 * elements to zero.
 */
export function setStrokeWidth(eles: SVG.Element[], value: unknown) {
  let n = interpretNumber(value);
  if (!n) {
    return;
  }

  let v = n.valueOf();
  if (v < 0) {
    v = 0;
  }

  eles.forEach(ele => {
    ele.attr('stroke-width', v);
  });
}
