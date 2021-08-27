import PptxGenJS from 'pptxgenjs';
import * as Svg from '@svgdotjs/svg.js';
import { pixelsToInches, pixelsToPoints } from './units';
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

function _elementImageOptions(ele: Svg.Element): object | undefined {
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
  let opts = {
    data: 'data:image/svg+xml;base64,' + base64,
    x: trimNum(pixelsToInches(bb.x - (sw / 2)), 4),
    y: trimNum(pixelsToInches(bb.y - (sw / 2)), 4),
    w: trimNum(pixelsToInches(bb.width + sw), 4),
    h: trimNum(pixelsToInches(bb.height + sw), 4),
  };
  if (opts.w > 0 && opts.h > 0) {
    return opts;
  }
}

function _addElementAsImage(slide: PptxGenJS.Slide, ele: Svg.Element) {
  let opts = _elementImageOptions(ele);
  if (opts) {
    slide.addImage(opts);
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
      _addElementAsImage(slide, c);
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
  _elementImageOptions,
};
