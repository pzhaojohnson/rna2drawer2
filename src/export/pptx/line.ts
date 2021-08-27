import * as SVG from '@svgdotjs/svg.js';
import { pixelsToInches, pixelsToPoints } from 'Export/units';
import { parseColor } from 'Parse/parseColor';
import { toPptxHex } from 'Export/pptx/color';
import { round } from 'Math/round';
import PptxGenJS from 'pptxgenjs';

export type LineOptions = {
  x: number;
  y: number;
  w: number;
  h: number;
  flipH: boolean;
  flipV: boolean;
  line: {
    color: string;
    width: number;
  };
}

function toPixels(v: any): number {
  let n = new SVG.Number(v);
  return n.convert('px').valueOf();
}

function coordinatesAndDimensions(line: SVG.Line) {
  let lx1 = toPixels(line.attr('x1'));
  let ly1 = toPixels(line.attr('y1'));
  let lx2 = toPixels(line.attr('x2'));
  let ly2 = toPixels(line.attr('y2'));
  let lxs = [lx1, lx2];
  let lys = [ly1, ly2];
  let x = pixelsToInches(Math.min(...lxs));
  let y = pixelsToInches(Math.min(...lys));
  let w = pixelsToInches(Math.max(...lxs) - Math.min(...lxs));
  let h = pixelsToInches(Math.max(...lys) - Math.min(...lys));
  return {
    x: round(x, 4),
    y: round(y, 4),
    w: round(w, 4),
    h: round(h, 4),
  };
}

function isFlippedH(line: SVG.Line): boolean {
  let lx1 = toPixels(line.attr('x1'));
  let lx2 = toPixels(line.attr('x2'));
  let lxs = [lx1, lx2];
  return lx1 > Math.min(...lxs);
}

function isFlippedV(line: SVG.Line): boolean {
  let ly1 = toPixels(line.attr('y1'));
  let ly2 = toPixels(line.attr('y2'));
  let lys = [ly1, ly2];
  return ly1 > Math.min(...lys);
}

function lineColor(line: SVG.Line): string {
  let sw = line.attr('stroke-width');
  let c = parseColor(sw);
  if (c) {
    return toPptxHex(c);
  } else {
    console.log(`Unable to parse line color: ${sw}. Defaulting to black.`);
    return '000000';
  }
}

function lineWidth(line: SVG.Line): number {
  let w = toPixels(line.attr('stroke-width'));
  return round(pixelsToPoints(w), 4);
}

export function lineOptions(line: SVG.Line): LineOptions {
  return {
    ...coordinatesAndDimensions(line),
    flipH: isFlippedH(line),
    flipV: isFlippedV(line),
    line: {
      color: lineColor(line),
      width: lineWidth(line),
    }
  };
}

export function addLine(slide: PptxGenJS.Slide, line: SVG.Line) {
  slide.addShape(
    PptxGenJS.ShapeType.line,
    lineOptions(line),
  );
}
