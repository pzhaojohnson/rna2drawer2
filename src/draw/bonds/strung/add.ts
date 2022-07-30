import * as SVG from '@svgdotjs/svg.js';

import type { StrungElement } from 'Draw/bonds/strung/StrungElement';

export function appendStrungElement(svg: SVG.Svg, ele: StrungElement) {
  if (ele.type == 'StrungText') {
    ele.text.addTo(svg);
  } else if (ele.type == 'StrungCircle') {
    ele.circle.addTo(svg);
  } else {
    ele.path.addTo(svg);
  }
}

export function removeStrungElement(ele: StrungElement) {
  if (ele.type == 'StrungText') {
    ele.text.remove();
  } else if (ele.type == 'StrungCircle') {
    ele.circle.remove();
  } else {
    ele.path.remove();
  }
}
