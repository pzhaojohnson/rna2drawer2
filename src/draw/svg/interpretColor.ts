import * as SVG from '@svgdotjs/svg.js';

// uses the SVG.Color constructor to interpret the given value as a color
// and returns undefined if the given value cannot be interpreted
export function interpretColor(v: any): SVG.Color | undefined {
  try {
    return new SVG.Color(v);
  } catch {}
}
