import * as SVG from '@svgdotjs/svg.js';
import { interpretColor } from 'Draw/svg/interpretColor';

/**
 * Returns the stroke of the elements.
 *
 * Returns undefined:
 *  1) for an empty array of elements,
 *  2) if not all elements have the same stroke, or
 *  3) if the stroke of an element cannot be interpreted as a color.
 *
 * This function cannot currently handle non-color stroke values
 * (e.g., gradients).
 */
export function stroke(eles: SVG.Element[]): SVG.Color | undefined {
  if (eles.length == 0) {
    return undefined;
  }

  let hexs = new Set(
    eles.map(ele => (
      interpretColor(ele.attr('stroke'))?.toHex().toLowerCase()
    ))
  );

  if (hexs.size != 1) {
    return undefined;
  }

  let hex: string | undefined = hexs.values().next().value;
  if (hex == undefined) {
    return undefined;
  }

  return interpretColor(hex);
}
