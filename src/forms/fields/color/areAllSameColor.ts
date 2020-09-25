import * as Svg from '@svgdotjs/svg.js';

/**
 * It is undefined what is returned for an empty list of colors.
 */
export function areAllSameColor(colors: Svg.Color[]): boolean {
  let hexs = new Set<string>();
  colors.forEach(c => {
    hexs.add(c.toHex().toLowerCase());
  });
  return hexs.size == 1;
}
