import * as SVG from '@svgdotjs/svg.js';
import { parseColor } from 'Parse/svg/color';

export function parseColors(vs: unknown[]): SVG.Color[] {
  let cs: SVG.Color[] = [];
  vs.forEach(v => {
    let c = parseColor(v);
    if (c) {
      cs.push(c);
    } else {
      console.log(`Unable to parse color: ${v}.`);
    }
  });
  return cs;
}
