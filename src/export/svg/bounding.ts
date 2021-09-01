import * as SVG from '@svgdotjs/svg.js';
import { parseNumber } from 'Parse/svg/number';

export type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
}

function merge(box1: Box, box2: Box): Box {
  let x = Math.min(box1.x, box2.x);
  let y = Math.min(box1.y, box2.y);
  return {
    x: x,
    y: y,
    width: Math.max(box1.x + box1.width, box2.x + box2.width) - x,
    height: Math.max(box1.y + box1.height, box2.y + box2.height) - y,
  };
}

function crudeTextBoundingBox(text: SVG.Text): Box {
  let x = parseNumber(text.attr('x'));
  let y = parseNumber(text.attr('y'));
  let fontSize = parseNumber(text.attr('font-size'));
  if (x && y && fontSize) {
    return {
      x: x.convert('px').valueOf(),
      y: y.convert('px').valueOf(),
      width: text.text().length * fontSize.convert('px').valueOf(),
      height: fontSize.convert('px').valueOf(),
    };
  } else {
    return text.bbox();
  }
}

function crudeElementBoundingBox(ele: SVG.Element): Box {
  if (ele instanceof SVG.Text) {
    return crudeTextBoundingBox(ele); // faster than bbox method
  } else {
    return ele.bbox();
  }
}

// May not be perfectly precise. Returns undefined for an empty list of elements.
export function crudeBoundingBox(eles: SVG.Element[]): Box | undefined {
  let merged: Box | undefined = undefined;
  eles.forEach(ele => {
    if (merged) {
      merged = merge(merged, crudeElementBoundingBox(ele));
    } else {
      merged = crudeElementBoundingBox(ele);
    }
  });
  return merged;
}
