import * as SVG from '@svgdotjs/svg.js';

import type { StrungElement } from 'Draw/bonds/strung/StrungElement';

export type NodeLike = (
  Node
  | SVG.Element
  | StrungElement
);

export function strungElementContainsNode(ele: StrungElement, node: NodeLike): boolean {
  if (node == ele) {
    return true;
  }

  let svgEle: SVG.Element;
  if (ele.type == 'StrungText') {
    svgEle = ele.text;
  } else if (ele.type == 'StrungCircle') {
    svgEle = ele.circle;
  } else {
    svgEle = ele.path;
  }

  if (node instanceof SVG.Element) {
    return node == svgEle;
  } else if (node instanceof Node) {
    return svgEle.node.contains(node);
  } else {
    return false;
  }
}

export function strungElementsContainNode(eles: StrungElement[], node: NodeLike): boolean {
  return eles.some(ele => strungElementContainsNode(ele, node));
}
