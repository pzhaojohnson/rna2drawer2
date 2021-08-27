import * as SVG from '@svgdotjs/svg.js';
import { pixelsToInches } from 'Export/units';
import { round } from 'Math/round';
import PptxGenJS from 'pptxgenjs';

export type ImageOptions = {
  data: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export function svgImageOptions(ele: SVG.Element): ImageOptions {
  let bbox = ele.bbox();
  let sw = ele.attr('stroke-width');
  if (typeof sw != 'number' || !Number.isFinite(sw)) {
    console.log(`Ignoring non-numeric stroke width: ${sw}.`);
    sw = 0;
  }

  // create a nested SVG document containing a copy of the element
  let svg = ele.root();
  let nested = svg.nested(); // the nested SVG document
  nested.svg(ele.svg());
  let first = nested.first(); // the copy of the element

  // make the nested SVG document just large enough to hold the element copy
  nested.viewbox(0, 0, bbox.width + sw, bbox.height + sw);
  nested.attr({ 'width': bbox.width + sw, 'height': bbox.height + sw });

  // center the element copy in the nested SVG document
  first.dmove(-bbox.x + (sw / 2), -bbox.y + (sw / 2));
  
  let svgString = nested.svg();
  
  // remove the nested SVG document
  nested.clear();
  nested.remove();
  
  return {
    data: 'data:image/svg+xml;base64,' + window.btoa(svgString),
    x: round(pixelsToInches(bbox.x - (sw / 2)), 4),
    y: round(pixelsToInches(bbox.y - (sw / 2)), 4),
    w: round(pixelsToInches(bbox.width + sw), 4),
    h: round(pixelsToInches(bbox.height + sw), 4),
  };
}

// doesn't add element if its resulting SVG image has zero area
// (SVG images of zero area seem to cause errors when exporting)
export function addAsSvgImage(slide: PptxGenJS.Slide, ele: SVG.Element) {
  let options = svgImageOptions(ele);
  
  if (options.w > 0 && options.h > 0) {
    slide.addImage(options);
  }
}
