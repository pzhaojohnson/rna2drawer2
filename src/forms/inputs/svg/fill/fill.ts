import * as SVG from '@svgdotjs/svg.js';
import { interpretColor } from 'Draw/svg/interpretColor';
import { colorsAreEqual } from 'Draw/svg/colorsAreEqual';

/**
 * Returns the fill of the elements.
 *
 * Returns undefined:
 *  1) for an empty array of elements,
 *  2) if not all elements have the same fill, or
 *  3) if the fill of an element cannot be interpreted as a color.
 *
 * This function cannot currently handle non-color fill values
 * (e.g., gradients).
 */
export function fill(eles: SVG.Element[]): SVG.Color | undefined {
  if (eles.length == 0) {
    return undefined;
  }

  let hexs = new Set(
    eles.map(ele => (
      interpretColor(ele.attr('fill'))?.toHex().toLowerCase()
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

/**
 * Returns true if the fill of the elements equals the given value.
 */
export function fillEquals(eles: SVG.Element[], value: SVG.Color): boolean {
  let v = fill(eles);
  if (v == undefined) {
    return false;
  }

  return colorsAreEqual(v, value);
}

/**
 * Sets the fill of each element to the given value.
 */
export function setFill(eles: SVG.Element[], value: SVG.Color) {
  let hex = value.toHex();
  eles.forEach(ele => {
    ele.attr('fill', hex);
  });
}
