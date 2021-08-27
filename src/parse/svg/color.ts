import * as Svg from '@svgdotjs/svg.js';

export function parseColor(c: any): Svg.Color | undefined {
  try {
    return new Svg.Color(c);
  } catch (err) {
    return undefined;
  }
}
