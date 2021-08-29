import * as SVG from '@svgdotjs/svg.js';
import { pixelsToInches, pixelsToPoints } from 'Export/units';
import { parseColor } from 'Parse/svg/color';
import { toPptxHex } from 'Export/pptx/color';
import { parseNumber } from 'Parse/svg/number';
import { round } from 'Math/round';
import PptxGenJS from 'pptxgenjs';

export type TextOptions = {
  x: number;
  y: number;
  w: number;
  h: number;
  align: 'center';
  valign: 'middle';
  margin: number;
  fontFace?: string;
  fontSize?: number;
  bold?: boolean;
  color?: string;
}

function coordinatesAndDimensions(text: SVG.Text) {
  let bbox = text.bbox();

  // multiply by two for some extra space around the text content
  let w = 2 * pixelsToInches(bbox.width);
  let h = 2 * pixelsToInches(bbox.height);
  
  let x = pixelsToInches(bbox.cx) - (w / 2);
  let y = pixelsToInches(bbox.cy) - (h / 2);
  
  return {
    x: round(x, 4),
    y: round(y, 4),
    w: round(w, 4),
    h: round(h, 4),
  };
}

function fontFace(text: SVG.Text): string | undefined {
  let ff = text.attr('font-family');
  if (typeof ff == 'string') {
    return ff;
  } else {
    console.error(`Font face of text is not a string: ${ff}.`);
  }
}

function fontSize(text: SVG.Text): number {
  let fs = text.attr('font-size');
  let n = parseNumber(fs);
  if (n) {
    let pxs = n.convert('px').valueOf();
    let pts = pixelsToPoints(pxs);
    return round(pts, 2);
  } else {
    console.error(`Unable to parse text font size: ${fs}. Defaulting to 9pt.`);
    return 9;
  }
}

function isBold(text: SVG.Text): boolean {
  let fw = text.attr('font-weight');
  return (
    fw == 'bold'
    || (typeof fw == 'number' && fw > 500)
  );
}

function color(text: SVG.Text): string | undefined {
  let f = text.attr('fill');
  let c = parseColor(f);
  if (c) {
    return toPptxHex(c);
  } else {
    console.error(`Unable to parse text fill: ${f}.`);
  }
}

export function textOptions(text: SVG.Text): TextOptions {
  return {
    ...coordinatesAndDimensions(text),
    align: 'center',
    valign: 'middle',
    margin: 0,
    fontFace: fontFace(text),
    fontSize: fontSize(text),
    bold: isBold(text),
    color: color(text),
  };
}

export function addText(slide: PptxGenJS.Slide, text: SVG.Text) {
  slide.addText(
    text.text(),
    textOptions(text),
  );
}
