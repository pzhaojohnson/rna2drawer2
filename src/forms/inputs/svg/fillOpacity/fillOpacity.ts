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
 * Sets the fill-opacity of each element to the number interpreted
 * from the given value.
 *
 * Does nothing if a number cannot be interpreted from the given value.
 *
 * Negative values are clamped to zero, and values above one are clamped
 * to one.
 */
export function setFillOpacity(eles: SVG.Element[], value: unknown) {
  let n = interpretNumber(value);
  if (!n) {
    return;
  }

  let v = n.valueOf();
  if (v < 0) {
    v = 0;
  } else if (v > 1) {
    v = 1;
  }

  eles.forEach(ele => {
    ele.attr('fill-opacity', v);
  });
}
