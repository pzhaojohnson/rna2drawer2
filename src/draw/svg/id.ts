import { SVGElementWrapper as Element } from './element';
import { v4 as uuid } from 'uuid';

export function assignUuid(ele: Element) {
  // IDs in XML documents must begin with a letter
  ele.id('u' + uuid());
}
