import * as SVG from '@svgdotjs/svg.js';
import { interpretColor } from 'Draw/svg/interpretColor';

export type HexCode = string;

/**
 * Returns the stroke of the elements.
 *
 * Returns undefined:
 *  1) for an empty array of elements or
 *  2) if not all elements have the same stroke.
 *
 * This function cannot currently handle non-color stroke values
 * (e.g., gradients).
 */
export function stroke(eles: SVG.Element[]): HexCode | undefined {
  if (eles.length == 0) {
    return undefined;
  }

  let hexs = new Set(
    eles.map(ele => (
      interpretColor(ele.attr('stroke'))?.toHex().toLowerCase()
    ))
  );

  if (hexs.size == 1) {
    return hexs.values().next().value;
  } else {
    return undefined;
  }
}
