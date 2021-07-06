import PptxGenJS from 'pptxgenjs';
import * as Svg from '@svgdotjs/svg.js';
import { pixelsToInches } from './pixelsToInches';
import { pixelsToPoints } from './pixelsToPoints';
import { pointsToInches } from './pointsToInches';
import { trimNum } from './trimNum';
import { parseColor } from 'Parse/parseColor';

/**
 * Converts the given color to a hex code compatible with PptxGenJS.
 */
function _pptxHex(color: Svg.Color): string {
  let hex = color.toHex();
  if (hex.charAt(0) == '#') {
    hex = hex.substring(1);
  }
  if (hex.length == 3) {
    hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
  }
  hex = hex.toUpperCase();
  return hex;
}

const _NUMBER_TRIM = 2;

function _trimNum(n: number): number {
  return trimNum(n, _NUMBER_TRIM);
}

function _setSlideDimensions(pres: PptxGenJS, svg: Svg.Svg) {
  let w = pixelsToInches(svg.viewbox().width);
  let h = pixelsToInches(svg.viewbox().height);
  pres.defineLayout({
    name: 'CUSTOM_LAYOUT',
    width: trimNum(w, 1),
    height: trimNum(h, 1),
  });
  pres.layout = 'CUSTOM_LAYOUT';
}

function _textWidth(text: Svg.Text): number {
  let bb = text.bbox();
  return pixelsToInches(3 * bb.width);
}

function _textHeight(text: Svg.Text): number {
  let bb = text.bbox();
  return pixelsToInches(2.5 * bb.height);
}

function _textOptions(text: Svg.Text): object {
  let fs = pixelsToPoints(text.attr('font-size'));
  let w = _textWidth(text);
  let h = _textHeight(text);
  let x = pixelsToInches(text.cx()) - (w / 2);
  let y = pixelsToInches(text.cy()) - (h / 2);
  let fw = text.attr('font-weight');
  let bold = false;
  if (fw === 'bold' || fw === 'bolder') {
    bold = true;
  } else if (typeof fw === 'number' && fw > 500) {
    bold = true;
  }
  let color = parseColor(text.attr('fill'));
  return {
    x: trimNum(x, 4),
    y: trimNum(y, 4),
    w: trimNum(w, 4),
    h: trimNum(h, 4),
    margin: 0,
    align: 'center',
    valign: 'middle',
    fontFace: text.attr('font-family'),
    fontSize: _trimNum(fs),
    bold: bold,
    color: color ? _pptxHex(color) : undefined,
  };
}

function _addText(slide: PptxGenJS.Slide, text: Svg.Text) {
  slide.addText(
    text.text(),
    _textOptions(text),
  );
}

function _lineOptions(line: Svg.Line): object {
  let xMin = Math.min(line.attr('x1'), line.attr('x2'));
  let xMax = Math.max(line.attr('x1'), line.attr('x2'));
  let yMin = Math.min(line.attr('y1'), line.attr('y2'));
  let yMax = Math.max(line.attr('y1'), line.attr('y2'));
  let x = pixelsToInches(xMin);
  let y = pixelsToInches(yMin);
  let w = pixelsToInches(xMax - xMin);
  let h = pixelsToInches(yMax - yMin);
  let lineColor = parseColor(line.attr('stroke'));
  return {
    x: trimNum(x, 4),
    y: trimNum(y, 4),
    w: trimNum(w, 4),
    h: trimNum(h, 4),
    flipH: line.attr('x1') > xMin,
    flipV: line.attr('y1') > yMin,
    line: {
      color: lineColor ? _pptxHex(lineColor) : undefined,
      width: _trimNum(pixelsToPoints(line.attr('stroke-width'))),
    }
  };
}

function _addLine(pres: PptxGenJS, slide: PptxGenJS.Slide, line: Svg.Line) {
  slide.addShape(
    pres.ShapeType.line,
    _lineOptions(line),
  );
}

function _circleOptions(circle: Svg.Circle): object {
  let x = circle.attr('cx') - circle.attr('r');
  let y = circle.attr('cy') - circle.attr('r');
  let w = 2 * circle.attr('r');
  let h = 2 * circle.attr('r');
  let line;
  if (circle.attr('stroke-opacity') > 0 && circle.attr('stroke-width') > 0) {
    let color = parseColor(circle.attr('stroke'));
    line = {
      color: color ? _pptxHex(color) : undefined,
      width: _trimNum(pixelsToPoints(circle.attr('stroke-width'))),
      transparency: 100 * (1 - circle.attr('stroke-opacity')),
    };
  }
  let fill;
  if (circle.attr('fill-opacity') > 0) {
    let color = parseColor(circle.attr('fill'));
    fill = {
      color: color ? _pptxHex(color) : undefined,
      transparency: 100 * (1 - circle.attr('fill-opacity')),
    };
  }
  return {
    x: trimNum(pixelsToInches(x), 4),
    y: trimNum(pixelsToInches(y), 4),
    w: trimNum(pixelsToInches(w), 4),
    h: trimNum(pixelsToInches(h), 4),
    line: line,
    fill: fill,
  };
}

function _addCircle(pres: PptxGenJS, slide: PptxGenJS.Slide, circle: Svg.Circle) {
  slide.addShape(
    pres.ShapeType.ellipse,
    _circleOptions(circle),
  );
}

function _rectOptions(rect: Svg.Rect): object {
  let line;
  if (rect.attr('stroke-opacity') > 0 && rect.attr('stroke-width') > 0) {
    let color = parseColor(rect.attr('stroke'));
    line = {
      color: color ? _pptxHex(color) : undefined,
      width: _trimNum(pixelsToPoints(rect.attr('stroke-width'))),
      transparency: 100 * (1 - rect.attr('stroke-opacity')),
    };
  }
  let fill;
  if (rect.attr('fill-opacity') > 0) {
    let color = parseColor(rect.attr('fill'));
    fill = {
      color: color ? _pptxHex(color) : undefined,
      transparency: 100 * (1 - rect.attr('fill-opacity')),
    };
  }
  return {
    x: trimNum(pixelsToInches(rect.attr('x')), 4),
    y: trimNum(pixelsToInches(rect.attr('y')), 4),
    w: trimNum(pixelsToInches(rect.attr('width')), 4),
    h: trimNum(pixelsToInches(rect.attr('height')), 4),
    line: line,
    fill: fill,
  };
}

function _addRect(pres: PptxGenJS, slide: PptxGenJS.Slide, rect: Svg.Rect) {
  slide.addShape(
    pres.ShapeType.rect,
    _rectOptions(rect),
  );
}

function _elementImageOptions(ele: Svg.Element): object {
  let bb = ele.bbox();
  let sw = ele.attr('stroke-width');
  if (typeof sw !== 'number' || !Number.isFinite(sw)) {
    sw = 0;
  }
  let svg = ele.root();
  let nested = svg.nested();
  nested.svg(ele.svg());
  let nele = nested.first();
  nested.viewbox(0, 0, bb.width + sw, bb.height + sw);
  nested.attr({ 'width': bb.width + sw, 'height': bb.height + sw });
  nele.dmove(-bb.x + (sw / 2), -bb.y + (sw / 2));
  let xml = nested.svg();
  nested.clear();
  nested.remove();
  let base64 = window.btoa(xml);
  return {
    data: 'data:image/svg+xml;base64,' + base64,
    x: trimNum(pixelsToInches(bb.x - (sw / 2)), 4),
    y: trimNum(pixelsToInches(bb.y - (sw / 2)), 4),
    w: trimNum(pixelsToInches(bb.width + sw), 4),
    h: trimNum(pixelsToInches(bb.height + sw), 4),
  };
}

function _addElementAsImage(slide: PptxGenJS.Slide, ele: Svg.Element) {
  let options: any = _elementImageOptions(ele);
  // adding an image of zero area seems to cause an error
  // when finally writing the PPTX file
  if (options.w > 0 && options.h > 0) {
    slide.addImage(options);
  }
}

function createPptxFromSvg(svg: Svg.Svg): PptxGenJS {
  let pres = new PptxGenJS();
  _setSlideDimensions(pres, svg);
  let slide = pres.addSlide();
  svg.children().forEach(v => {
    let c = v as Svg.Element;
    if (c.type === 'text') {
      _addText(slide, c as Svg.Text);
    } else if (c.type === 'line') {
      _addLine(pres, slide, c as Svg.Line);
    } else if (c.type === 'circle') {
      // add as image since shape line transparency
      // doesn't work correctly at the moment
      //_addCircle(pres, slide, c as Svg.Circle);
      _addElementAsImage(slide, c);
    } else if (c.type === 'rect') {
      // add as image since shape line transparency
      // doesn't work correctly at the moment
      //_addRect(pres, slide, c as Svg.Rect);
      _addElementAsImage(slide, c);
    } else if (c.type === 'path') {
      _addElementAsImage(slide, c);
    } else {
      // can't just add any element as an image
      // since some elements (e.g., defs) cause an error
      // when attempting to add them as an image
      console.log('Unrecognized element type: ', c.type);
    }
  });
  return pres;
}

export {
  createPptxFromSvg,

  // these are only exported to aid testing
  _pptxHex,
  _NUMBER_TRIM,
  _trimNum,
  _textOptions,
  _lineOptions,
  _circleOptions,
  _rectOptions,
  _elementImageOptions,
};
