import { SVGElementWrapper as Element } from 'Draw/svg/SVGElementWrapper';
import { v4 as UUID } from 'uuid';

export function assignUuid(ele: Element) {
  // IDs in XML documents must begin with a letter
  ele.id('i' + UUID());
}

export const uuidRegex = /[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}/;
