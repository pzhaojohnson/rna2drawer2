import * as SVG from '@svgdotjs/svg.js';

// uses the SVG.Number constructor to interpret the given value as a number
// and returns undefined if the given value cannot be interpreted
export function interpretNumber(v: any): SVG.Number | undefined {
  try {
    return new SVG.Number(v);
  } catch {}
}
