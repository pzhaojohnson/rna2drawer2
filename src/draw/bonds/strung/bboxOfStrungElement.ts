import * as SVG from '@svgdotjs/svg.js';

import type { StrungElement } from 'Draw/bonds/strung/StrungElement';

export function bboxOfStrungElement(ele: StrungElement): SVG.Box {
  if (ele.type == 'StrungText') {
    return ele.text.bbox();
  } else if (ele.type == 'StrungCircle') {
    return ele.circle.bbox();
  } else {
    return ele.path.bbox();
  }
}

/**
 * Returns undefined for an empty array of strung elements.
 */
export function bboxOfStrungElements(eles: StrungElement[]): SVG.Box | undefined {
  if (eles.length == 0) {
    return undefined;
  } else {
    let bbox = bboxOfStrungElement(eles[0]);
    eles.slice(1).forEach(ele => {
      bbox = bbox.merge(bboxOfStrungElement(ele));
    });
    return bbox;
  }
}
