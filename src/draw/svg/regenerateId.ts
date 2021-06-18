import { SVGElementWrapper as Element } from './element';

export function regenerateId(ele: Element) {
  ele.id('');
  ele.id();
}
