import * as SVG from '@svgdotjs/svg.js';
import { interpretNumber } from 'Draw/svg/interpretNumber';
import { bboxOfLine } from 'Draw/svg/bboxOfLine';
import { bboxOfCircle } from 'Draw/svg/bboxOfCircle';
import { pixelsToInches } from 'Export/units';
import { round } from 'Math/round';
import PptxGenJS from 'pptxgenjs';

function strokeWidth(ele: SVG.Element): number {
  let sw = ele.attr('stroke-width');
  let n = interpretNumber(sw);
  if (n) {
    return n.convert('px').valueOf();
  } else {
    console.log(`Ignoring non-numeric stroke width: ${sw}.`);
    return 0;
  }
}

/**
 * Calculates the bounding box of the element more precisely
 * than the built-in bbox method, which does not seem to account
 * for stroke width and stroke line cap.
 */
function bboxOfElement(ele: SVG.Element): SVG.Box {
  // use type-specific bbox functions when possible
  if (ele instanceof SVG.Line) {
    return bboxOfLine(ele);
  } else if (ele instanceof SVG.Circle) {
    return bboxOfCircle(ele);
  }

  let bbox = ele.bbox();

  // account for stroke width
  let sw = strokeWidth(ele);
  let w = bbox.width + sw;
  let h = bbox.height + sw;

  let x = bbox.cx - (w / 2);
  let y = bbox.cy - (h / 2);

  return new SVG.Box(x, y, w, h);
}

export type ImageOptions = {
  data: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export function svgImageOptions(ele: SVG.Element): ImageOptions {
  let bbox = bboxOfElement(ele);

  let svg = ele.root();
  let nested = svg.nested(); // a nested SVG document

  // xmlns attribute must be defined
  nested.attr('xmlns', 'http://www.w3.org/2000/svg');

  nested.svg(ele.svg());
  let first = nested.first(); // a copy of the element

  // a width or height of less than 1 seems to cause errors
  // (so make at least 2 to be safe)
  let w = Math.max(2, bbox.width);
  let h = Math.max(2, bbox.height);

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
