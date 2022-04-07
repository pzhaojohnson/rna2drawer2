import * as SVG from '@svgdotjs/svg.js';

export function colorsAreEqual(color1: SVG.Color, color2: SVG.Color): boolean {
  color1 = color1.rgb();
  color2 = color2.rgb();
  return (
    color1.r == color2.r
    && color1.g == color2.g
    && color1.b == color2.b
  );
}
