import { interpretColorValue } from 'Draw/svg/interpretColorValue';
import { colorsAreEqual } from 'Draw/svg/colorsAreEqual';

/**
 * A color value is a value assigned to an SVG element attribute
 * specifying a color (e.g., a hex code string or RGB string).
 *
 * Returns true if the two color values specify the same color
 * and false otherwise.
 *
 * Returns false if either of the color values cannot be interpreted
 * as a color.
 */
export function colorValuesAreEqual(value1: unknown, value2: unknown): boolean {
  let color1 = interpretColorValue(value1);
  let color2 = interpretColorValue(value2);

  if (!color1 || !color2) {
    return false;
  } else {
    return colorsAreEqual(color1, color2);
  }
}
