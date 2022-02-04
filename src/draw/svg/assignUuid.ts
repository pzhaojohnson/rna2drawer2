import * as SVG from '@svgdotjs/svg.js';
import { SVGElementWrapper } from 'Draw/svg/SVGElementWrapper';
import { v4 as UUID } from 'uuid';

// assigns a UUID to the given element that is compatible
// with SVG rules for element IDs
export function assignUuid(ele: SVG.Element | SVGElementWrapper) {
  // IDs in XML documents must begin with a letter
  ele.id('i' + UUID());
}

export const uuidRegex = /[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}/;
