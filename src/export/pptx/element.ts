import * as SVG from '@svgdotjs/svg.js';
import { parseNumber } from 'Parse/svg/number';
import { pixelsToInches } from 'Export/units';
import { round } from 'Math/round';
import PptxGenJS from 'pptxgenjs';

function strokeWidth(ele: SVG.Element): number {
  let sw = ele.attr('stroke-width');
  let n = parseNumber(sw);
  if (n) {
    return n.convert('px').valueOf();
  } else {
    console.log(`Ignoring non-numeric stroke width: ${sw}.`);
    return 0;
  }
}

export type ImageOptions = {
  data: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export function svgImageOptions(ele: SVG.Element): ImageOptions {
  let bbox = ele.bbox();
  let sw = strokeWidth(ele);

  let svg = ele.root();
  let nested = svg.nested(); // a nested SVG document

  // xmlns attribute must be defined
  nested.attr('xmlns', 'http://www.w3.org/2000/svg');

  nested.svg(ele.svg());
  let first = nested.first(); // a copy of the element

  // a width or height of less than 1 seems to cause errors
  // (so make at least 2 to be safe)
  let w = Math.max(2, bbox.width + sw);
  let h = Math.max(2, bbox.height + sw);

  let x = bbox.cx - (w / 2);
  let y = bbox.cy - (h / 2);

  // make the nested SVG document large enough to hold the element copy
  nested.viewbox(0, 0, w, h);
  nested.attr({ 'width': w, 'height': h });

  // center the element copy in the nested SVG document
  first.center(w / 2, h / 2);

  let svgString = nested.svg();

  // remove the nested SVG document
  nested.clear();
  nested.remove();

  return {
    data: 'data:image/svg+xml;base64,' + Buffer.from(svgString).toString('base64'),
    x: round(pixelsToInches(x), 6),
    y: round(pixelsToInches(y), 6),
    w: round(pixelsToInches(w), 6),
    h: round(pixelsToInches(h), 6),
  };
}

export function addAsSvgImage(slide: PptxGenJS.Slide, ele: SVG.Element) {
  let options = svgImageOptions(ele);
  slide.addImage(options);
}
