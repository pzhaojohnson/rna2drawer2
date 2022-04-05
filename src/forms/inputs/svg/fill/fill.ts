import * as SVG from '@svgdotjs/svg.js';
import { interpretColor } from 'Draw/svg/interpretColor';

export type HexCode = string;

/**
 * Returns the fill of the elements.
 *
 * Returns undefined:
 *  1) for an empty array of elements or
 *  2) if not all elements have the same fill.
 *
 * This function cannot currently handle non-color fill values
 * (e.g., gradients).
 */
export function fill(eles: SVG.Element[]): HexCode | undefined {
  if (eles.length == 0) {
    return undefined;
  }

  let hexs = new Set(
    eles.map(ele => (
      interpretColor(ele.attr('fill'))?.toHex().toLowerCase()
    ))
  );

  if (hexs.size == 1) {
    return hexs.values().next().value;
  } else {
    return undefined;
  }
}
