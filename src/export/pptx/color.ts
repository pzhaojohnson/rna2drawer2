import * as SVG from '@svgdotjs/svg.js';

export function toPptxHex(color: SVG.Color): string {
  let hex = color.toHex();
  if (hex.charAt(0) == '#') {
    hex = hex.substring(1);
  }
  if (hex.length == 3) {
    let c1 = hex.charAt(0);
    let c2 = hex.charAt(1);
    let c3 = hex.charAt(2);
    hex = c1 + c1 + c2 + c2 + c3 + c3;
  }
  hex = hex.toUpperCase();
  return hex;
}
