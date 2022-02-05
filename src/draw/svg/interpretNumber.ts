import * as SVG from '@svgdotjs/svg.js';

export function interpretNumber(v: any): SVG.Number | undefined {
  try {
    return new SVG.Number(v);
  } catch {}
}
