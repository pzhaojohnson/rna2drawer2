import { SVGElementWrapper as Element } from './element';
import { v4 as uuid } from 'uuid';

export function assignUuid(ele: Element) {
  // IDs in XML documents must begin with a letter
  ele.id('i' + uuid());
}

export const uuidRegex = /[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}/;
