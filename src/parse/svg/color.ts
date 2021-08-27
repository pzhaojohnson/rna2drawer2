import * as SVG from '@svgdotjs/svg.js';

export function parseColor(v: any): SVG.Color | undefined {
  try {
    return new SVG.Color(v);
  } catch {}
}
