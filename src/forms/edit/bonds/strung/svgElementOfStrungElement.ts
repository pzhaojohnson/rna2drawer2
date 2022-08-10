import * as SVG from '@svgdotjs/svg.js';

import type { StrungElement } from 'Draw/bonds/strung/StrungElement';

/**
 * Returns the SVG element of the strung element.
 */
export function svgElementOfStrungElement(ele: StrungElement): SVG.Element {
  if (ele.type == 'StrungText') {
    return ele.text;
  } else if (ele.type == 'StrungCircle') {
    return ele.circle;
  } else {
    return ele.path;
  }
}
