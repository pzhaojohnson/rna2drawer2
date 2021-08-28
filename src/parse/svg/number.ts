import * as SVG from '@svgdotjs/svg.js';

export function parseNumber(v: any): SVG.Number | undefined {
  try {
    return new SVG.Number(v);
  } catch {}
}
