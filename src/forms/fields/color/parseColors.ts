import * as SVG from '@svgdotjs/svg.js';
import { interpretColor } from 'Draw/svg/interpretColor';

export function parseColors(vs: unknown[]): SVG.Color[] {
  let cs: SVG.Color[] = [];
  vs.forEach(v => {
    let c = interpretColor(v);
    if (c) {
      cs.push(c);
    } else {
      console.log(`Unable to parse color: ${v}.`);
    }
  });
  return cs;
}
