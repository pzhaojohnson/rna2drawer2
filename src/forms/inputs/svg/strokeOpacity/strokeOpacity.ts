import * as SVG from '@svgdotjs/svg.js';
import { interpretNumber } from 'Draw/svg/interpretNumber';

/**
 * Returns the stroke-opacity of the elements or undefined
 * for an empty array of elements or if not all elements have
 * the same stroke-opacity.
 */
export function strokeOpacity(eles: SVG.Element[]): number | undefined {
  if (eles.length == 0) {
    return undefined;
  }

  let values = new Set(
    eles.map(ele => (
      interpretNumber(ele.attr('stroke-opacity'))?.valueOf()
    ))
  );

  if (values.size == 1) {
    return values.values().next().value;
  } else {
    return undefined;
  }
}

/**
 * Sets the stroke-opacity of each element to the given value.
 *
 * Does nothing if the given value is nonfinite.
 *
 * Values less than zero are clamped to zero, and values greater than one
 * are clamped to one.
 */
export function setStrokeOpacity(eles: SVG.Element[], value: number) {
  if (!Number.isFinite(value)) {
    return;
  }

  if (value < 0) {
    value = 0;
  } else if (value > 1) {
    value = 1;
  }

  eles.forEach(ele => {
    ele.attr('stroke-opacity', value);
  });
}
