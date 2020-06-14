import PptxGenJS from 'pptxgenjs';
import {
  SvgInterface as Svg,
  SvgElementInterface as SvgElement,
  SvgTextInterface as SvgText,
  SvgLineInterface as SvgLine,
  SvgPathInterface as SvgPath,
  SvgCircleInterface as SvgCircle,
  SvgRectInterface as SvgRect,
} from '../draw/SvgInterface';
import { pixelsToInches } from './pixelsToInches';
import { pixelsToPoints } from './pixelsToPoints';
import { pointsToInches } from './pointsToInches';
import { trimNum } from './trimNum';

/**
 * Converts the given hex code to a format compatible with PptxGenJS.
 * 
 * If the given hex code is a string and the first character is a '#',
 * this function will remove the '#'. Otherwise, this function will simply
 * return the given string.
 * 
 * If the given hex code is a number, this function will return the string
 * of that number.
 * 
 * If the given hex code has a different type (e.g. undefined), this function
 * will return '000000'.
 */
function _pptxHex(hex: (string | number)): string {
  if (typeof hex === 'string') {
    if (hex.charAt(0) === '#') {
      return hex.substring(1);
    }
    return hex;
  } else if (typeof hex === 'number') {
    return hex.toString();
  }
  return '000000';
}

const _NUMBER_TRIM = 2;

function _trimNum(n: number): number {
  return trimNum(n, _NUMBER_TRIM);
}

function _setSlideDimensions(pres: PptxGenJS, svg: Svg) {
  let w = pixelsToInches(svg.viewbox().width);
  let h = pixelsToInches(svg.viewbox().height);
  pres.defineLayout({
    name: 'CUSTOM_LAYOUT',
    width: _trimNum(w),
    height: _trimNum(h),
  });
  pres.layout = 'CUSTOM_LAYOUT';
}

function _textWidth(text: SvgText): number {
  let bb = text.bbox();
  return pixelsToInches(4 * bb.width);
}

function _textHeight(text: SvgText): number {
  let bb = text.bbox();
  return pixelsToInches(2 * bb.height);
}

function _textOptions(text: SvgText): object {
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
  return {
    x: _trimNum(x),
    y: _trimNum(y),
    w: _trimNum(w),
    h: _trimNum(h),
    align: 'center',
    valign: 'middle',
    fontFace: text.attr('font-family'),
    fontSize: _trimNum(fs),
    bold: bold,
    color: _pptxHex(text.attr('fill')),
  };
}

function _addText(slide: PptxGenJS.Slide, text: SvgText) {
  slide.addText(
    text.text(),
    _textOptions(text),
  );
}

function _lineOptions(line: SvgLine): object {
  let xMin = Math.min(line.attr('x1'), line.attr('x2'));
  let xMax = Math.max(line.attr('x1'), line.attr('x2'));
  let yMin = Math.min(line.attr('y1'), line.attr('y2'));
  let yMax = Math.max(line.attr('y1'), line.attr('y2'));
  let x = pixelsToInches(xMin);
  let y = pixelsToInches(yMin);
  let w = pixelsToInches(xMax - xMin);
  let h = pixelsToInches(yMax - yMin);
  return {
    x: _trimNum(x),
    y: _trimNum(y),
    w: _trimNum(w),
    h: _trimNum(h),
    flipH: line.attr('x1') > xMin,
    flipV: line.attr('y1') > yMin,
    line: _pptxHex(line.attr('stroke')),
    lineSize: _trimNum(pixelsToPoints(line.attr('stroke-width'))),
  };
}

function _addLine(pres: PptxGenJS, slide: PptxGenJS.Slide, line: SvgLine) {
  slide.addShape(
    pres.ShapeType.line,
    _lineOptions(line),
  );
}

function _circleOptions(circle: SvgCircle): object {
  let x = circle.attr('cx') - circle.attr('r');
  let y = circle.attr('cy') - circle.attr('r');
  let w = 2 * circle.attr('r');
  let h = 2 * circle.attr('r');
  return {
    x: _trimNum(pixelsToInches(x)),
    y: _trimNum(pixelsToInches(y)),
    w: _trimNum(pixelsToInches(w)),
    h: _trimNum(pixelsToInches(h)),
    line: {
      type: 'solid',
      color: _pptxHex(circle.attr('stroke')),
      alpha: 100 * (1 - circle.attr('stroke-opacity')),
    },
    lineSize: _trimNum(pixelsToPoints(circle.attr('stroke-width'))),
    fill: {
      type: 'solid',
      color: _pptxHex(circle.attr('fill')),
      alpha: 100 * (1 - circle.attr('fill-opacity')),
    },
  };
}

function _addCircle(pres: PptxGenJS, slide: PptxGenJS.Slide, circle: SvgCircle) {
  slide.addShape(
    pres.ShapeType.ellipse,
    _circleOptions(circle),
  );
}

function _rectOptions(rect: SvgRect): object {
  return {
    x: _trimNum(pixelsToInches(rect.attr('x'))),
    y: _trimNum(pixelsToInches(rect.attr('y'))),
    w: _trimNum(pixelsToInches(rect.attr('width'))),
    h: _trimNum(pixelsToInches(rect.attr('height'))),
    line: {
      type: 'solid',
      color: _pptxHex(rect.attr('stroke')),
      alpha: 100 * (1 - rect.attr('stroke-opacity')),
    },
    lineSize: _trimNum(pixelsToPoints(rect.attr('stroke-width'))),
    fill: {
      type: 'solid',
      color: _pptxHex(rect.attr('fill')),
      alpha: 100 * (1 - rect.attr('fill-opacity')),
    },
  };
}

function _addRect(pres: PptxGenJS, slide: PptxGenJS.Slide, rect: SvgRect) {
  slide.addShape(
    pres.ShapeType.rect,
    _rectOptions(rect),
  );
}

function _elementImageOptions(ele: SvgElement): object {
  let bb = ele.bbox();
  let sw = ele.attr('stroke-width');
  if (typeof sw !== 'number' || !Number.isFinite(sw)) {
    sw = 0;
  }
  let svg = ele.root();
  let nested = svg.nested();
  nested.svg(ele.svg());
  let nele = nested.first() as SvgElement;
  nested.viewbox(0, 0, bb.width + sw, bb.height + sw);
  nested.attr({ 'width': bb.width + sw, 'height': bb.height + sw });
  nele.dmove(-bb.x + (sw / 2), -bb.y + (sw / 2));
  let xml = nested.svg();
  nested.clear();
  nested.remove();
  let base64 = window.btoa(xml);
  return {
    data: 'data:image/svg+xml;base64,' + base64,
    x: _trimNum(pixelsToInches(bb.x - (sw / 2))),
    y: _trimNum(pixelsToInches(bb.y - (sw / 2))),
    w: _trimNum(pixelsToInches(bb.width + sw)),
    h: _trimNum(pixelsToInches(bb.height + sw)),
  };
}

function _addElementAsImage(slide: PptxGenJS.Slide, ele: SvgElement) {
  slide.addImage(
    _elementImageOptions(ele)
  );
}

function createPptxFromSvg(svg: Svg): PptxGenJS {
  let pres = new PptxGenJS();
  _setSlideDimensions(pres, svg);
  let slide = pres.addSlide();
  svg.children().forEach((c: SvgElement) => {
    if (c.type === 'text') {
      _addText(slide, c as SvgText);
    } else if (c.type === 'line') {
      _addLine(pres, slide, c as SvgLine);
    } else if (c.type === 'circle') {
      _addCircle(pres, slide, c as SvgCircle);
    } else if (c.type === 'rect') {
      _addRect(pres, slide, c as SvgRect);
    } else {
      _addElementAsImage(slide, c);
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
