import {
  createPptxFromSvg,
  _pptxHex,
  _NUMBER_TRIM,
  _trimNum,
  _textOptions,
  _lineOptions,
  _circleOptions,
  _rectOptions,
  _elementImageOptions,
} from './createPptxFromSvg';
import { trimNum } from './trimNum';
import createNodeSVG from '../draw/createNodeSVG';
const fs = require('fs');
import { pixelsToPoints } from './pixelsToPoints';
import { pixelsToInches } from './pixelsToInches';
import { pointsToPixels } from './pointsToPixels';
import { pointsToInches } from './pointsToInches';
import PptxGenJs from 'pptxgenjs';
import * as Svg from '@svgdotjs/svg.js';

describe('_pptxHex function', () => {
  it('removes leading #', () => {
    let c = new Svg.Color('#ab12dd');
    let hex = _pptxHex(c);
    expect(hex).toBe('AB12DD');
  });

  it('expands hex codes with 3 numbers to 6 numbers', () => {
    let c = new Svg.Color('#1fd');
    let hex = _pptxHex(c);
    expect(hex).toBe('11FFDD');
  });

  it('capitalizes hex code', () => {
    let c = new Svg.Color('#aabbde');
    let hex = _pptxHex(c);
    expect(hex).toBe('AABBDE');
  });
});

it('_trimNum function', () => {
  let n = 7.1298471294;
  let trimmed = trimNum(n, _NUMBER_TRIM);
  expect(trimmed).not.toEqual(n);
  expect(_trimNum(n)).toEqual(trimmed);
});

describe('_textOptions function', () => {
  describe('font-size, w and h', () => {
    it('gives correct values', () => {
      let svg = createNodeSVG();
      let t = svg.text(add => add.tspan('T'));
      t.attr({ 'font-size': pointsToPixels(20) });
      let tos = _textOptions(t);
      expect(tos.fontSize).toBeCloseTo(20, 2);
      expect(tos.w).toBeCloseTo(0.61, 2);
      expect(tos.h).toBeCloseTo(0.76, 2);
    });

    it('trims numbers', () => {
      let svg = createNodeSVG();
      let t = svg.text(add => add.tspan('Y'));
      let fs = 12.2339587128947;
      expect(_trimNum(fs)).not.toEqual(fs);
      t.attr({ 'font-size': fs });
      let tos = _textOptions(t);
      expect(_trimNum(tos.fontSize)).toEqual(tos.fontSize);
      expect(_trimNum(tos.w)).toEqual(tos.w);
      expect(_trimNum(tos.h)).toEqual(tos.h);
    });
  });

  describe('x and y', () => {
    it('gives correct values', () => {
      let svg = createNodeSVG();
      let t = svg.text(add => add.tspan('A'));
      t.attr({
        'x': 50,
        'y': 100,
        'font-size': pointsToPixels(12),
      });
      let tos = _textOptions(t);
      expect(tos.x).toBeCloseTo(0.36, 2);
      expect(tos.y).toBeCloseTo(0.75, 2);
    });

    it('trims numbers', () => {
      let svg = createNodeSVG();
      let x = 6.19847129847;
      let y = 7.1893781257;
      expect(_trimNum(x)).not.toEqual(x);
      expect(_trimNum(y)).not.toEqual(y);
      let t = svg.text(add => add.tspan('Y'));
      t.attr({ 'x': x, 'y': y });
      let tos = _textOptions(t);
      expect(_trimNum(tos.x)).toEqual(tos.x);
      expect(_trimNum(tos.y)).toEqual(tos.y);
    });
  });

  describe('bold', () => {
    it('font-weight is normal, bold, bolder, 400 or 700', () => {
      let svg = createNodeSVG();
      let t = svg.text(add => add.tspan('G'));
      t.attr({ 'font-weight': 'normal' });
      expect(_textOptions(t).bold).toBe(false);
      t.attr({ 'font-weight': 'bold' });
      expect(_textOptions(t).bold).toBe(true);
      t.attr({ 'font-weight': 'bolder' });
      expect(_textOptions(t).bold).toBe(true);
      t.attr({ 'font-weight': 400 });
      expect(_textOptions(t).bold).toBe(false);
      t.attr({ 'font-weight': 700 });
      expect(_textOptions(t).bold).toBe(true);
    });
  });

  it('gives correct fontFace, align and valign', () => {
    let svg = createNodeSVG();
    let t = svg.text(add => add.tspan('A'));
    t.attr({ 'font-family': 'Consolas' });
    let tos = _textOptions(t);
    expect(tos.fontFace).toBe('Consolas');
    expect(tos.align).toBe('center');
    expect(tos.valign).toBe('middle');
  });

  it('gives correct color (and uses _pptxHex function', () => {
    let svg = createNodeSVG();
    let t = svg.text(add => add.tspan('A'));
    t.attr({ 'fill': '#152637' });
    let tos = _textOptions(t);
    expect(tos.color).toBe('152637');
  });
});

describe('_lineOptions function', () => {
  describe('x, y, w and h', () => {
    it('flipped horizontally and not flipped vertically', () => {
      let svg = createNodeSVG();
      let l = svg.line(120, 15, 20, 75);
      let los = _lineOptions(l);
      expect(los.x).toBeCloseTo(pixelsToInches(20), 2);
      expect(los.y).toBeCloseTo(pixelsToInches(15), 2);
      expect(los.w).toBeCloseTo(pixelsToInches(100), 2);
      expect(los.h).toBeCloseTo(pixelsToInches(60), 1);
    });

    it('not flipped horizontally and flipped vertically', () => {
      let svg = createNodeSVG();
      let l = svg.line(70, 250, 190, 90);
      let los = _lineOptions(l);
      expect(los.x).toBeCloseTo(pixelsToInches(70), 2);
      expect(los.y).toBeCloseTo(pixelsToInches(90), 2);
      expect(los.w).toBeCloseTo(pixelsToInches(120), 2);
      expect(los.h).toBeCloseTo(pixelsToInches(160), 2);
    });

    it('trims numbers', () => {
      let svg = createNodeSVG();
      let x1 = 5.198471284;
      let y1 = 6.1841289414;
      let x2 = 12.2358738471;
      let y2 = 5.12984712847;
      expect(_trimNum(x1)).not.toEqual(x1);
      expect(_trimNum(y1)).not.toEqual(y1);
      expect(_trimNum(x2)).not.toEqual(x2);
      expect(_trimNum(y2)).not.toEqual(y2);
      let l = svg.line(x1, y1, x2, y2);
      let los = _lineOptions(l);
      expect(_trimNum(los.x)).toEqual(los.x);
      expect(_trimNum(los.y)).toEqual(los.y);
      expect(_trimNum(los.w)).toEqual(los.w);
      expect(_trimNum(los.h)).toEqual(los.h);
    });
  });

  describe('flipH and flipV', () => {
    it('flipped horizontally and not flipped vertically', () => {
      let svg = createNodeSVG();
      let l = svg.line(100, 8, 20, 40);
      let los = _lineOptions(l);
      expect(los.flipH).toBe(true);
      expect(los.flipV).toBe(false);
    });

    it('not flipped horizontally and flipped vertically', () => {
      let svg = createNodeSVG();
      let l = svg.line(30, 200, 90, 120);
      let los = _lineOptions(l);
      expect(los.flipH).toBe(false);
      expect(los.flipV).toBe(true);
    });
  });

  it('line and lineSize (and uses _pptxHex function)', () => {
    let svg = createNodeSVG();
    let l = svg.line(1, 3, 5, 7);
    l.attr({
      'stroke': '#aabbcc',
      'stroke-width': pointsToPixels(2),
    });
    let los = _lineOptions(l);
    expect(los.line).toBe('AABBCC');
    expect(los.lineSize).toBeCloseTo(2, 2);
  });

  it('trims lineSize', () => {
    let svg = createNodeSVG();
    let l = svg.line(2, 4, 6, 8);
    let sw = 2.23938471298;
    expect(_trimNum(sw)).not.toEqual(sw);
    l.attr({ 'stroke-width': sw });
    let los = _lineOptions(l);
    expect(_trimNum(los.lineSize)).toEqual(los.lineSize);
  });
});

describe('_circleOptions function', () => {
  describe('x, y, w and h', () => {
    it('gives correct values', () => {
      let svg = createNodeSVG();
      let c = svg.circle(20);
      c.attr({
        'cx': 40,
        'cy': 100,
      });
      let cos = _circleOptions(c);
      expect(cos.x).toBeCloseTo(pixelsToInches(30), 2);
      expect(cos.y).toBeCloseTo(pixelsToInches(90), 2);
      expect(cos.w).toBeCloseTo(pixelsToInches(20), 2);
      expect(cos.h).toBeCloseTo(pixelsToInches(20), 2);
    });

    it('trims numbers', () => {
      let svg = createNodeSVG();
      let d = 6.12481724871;
      let cx = 6.12984718247;
      let cy = 8.39857128471;
      expect(_trimNum(d)).not.toEqual(d);
      expect(_trimNum(cx)).not.toEqual(cx);
      expect(_trimNum(cy)).not.toEqual(cy);
      let c = svg.circle(d);
      c.attr({ 'cx': cx, 'cy': cy });
      let cos = _circleOptions(c);
      expect(_trimNum(cos.x)).toEqual(cos.x);
      expect(_trimNum(cos.y)).toEqual(cos.y);
      expect(_trimNum(cos.w)).toEqual(cos.w);
      expect(_trimNum(cos.h)).toEqual(cos.h);
    });
  });

  it('gives correct line (and uses _pptxHex function)', () => {
    let svg = createNodeSVG();
    let c = svg.circle(100);
    c.attr({
      'stroke': '#987654',
      'stroke-width': 2,
      'stroke-opacity': 0.4,
    });
    let cos = _circleOptions(c);
    expect(cos.line.type).toBe('solid');
    expect(cos.line.color).toBe('987654');
    expect(cos.line.alpha).toBeCloseTo(60, 2);
  });

  it('sets line alpha to 100 when line size is 0', () => {
    /* For some reason setting line size to 0 results in a line size
    of 0.75 pt when the PPTX file is opened in PowerPoint. Setting alpha
    to 100 keeps the line invisible. */
    let svg = createNodeSVG();
    let c = svg.circle(25);
    c.attr({ 'stroke-width': 0, 'stroke-opacity': 0.5 });
    let cos = _circleOptions(c);
    expect(cos.line.alpha).toBe(100);
  });

  describe('lineSize', () => {
    it('gives correct value', () => {
      let svg = createNodeSVG();
      let c = svg.circle(20);
      c.attr({
        'stroke-width': pointsToPixels(2),
        'stroke-opacity': 0.5,
      });
      let cos = _circleOptions(c);
      expect(cos.lineSize).toBeCloseTo(2, 2);
    });

    it('trims number', () => {
      let svg = createNodeSVG();
      let c = svg.circle(20);
      let sw = 5.19284719194;
      expect(_trimNum(sw)).not.toEqual(sw);
      c.attr({ 'stroke-width': sw });
      let cos = _circleOptions(c);
      expect(cos.lineSize).toBeGreaterThan(0);
      expect(_trimNum(cos.lineSize)).toEqual(cos.lineSize);
    });
  });

  it('gives correct fill (and uses _pptxHex function)', () => {
    let svg = createNodeSVG();
    let c = svg.circle(20);
    c.attr({
      'fill': '#998877',
      'fill-opacity': 0.3,
    });
    let cos = _circleOptions(c);
    expect(cos.fill.type).toBe('solid');
    expect(cos.fill.color).toBe('998877');
    expect(cos.fill.alpha).toBeCloseTo(70, 2);
  });
});

describe('_rectOptions function', () => {
  describe('x, y, w and h', () => {
    it('gives correct values', () => {
      let svg = createNodeSVG();
      let r = svg.rect(110, 70);
      r.attr({ 'x': 20, 'y': 200 });
      let ros = _rectOptions(r);
      expect(ros.x).toBeCloseTo(pixelsToInches(20), 2);
      expect(ros.y).toBeCloseTo(pixelsToInches(200), 2);
      expect(ros.w).toBeCloseTo(pixelsToInches(110), 2);
      expect(ros.h).toBeCloseTo(pixelsToInches(70), 2);
    });

    it('trims numbers', () => {
      let svg = createNodeSVG();
      let x = 6.1984719247;
      let y = 12.29857387;
      let w = 56.1298471847;
      let h = 100.23857387;
      expect(_trimNum(x)).not.toEqual(x);
      expect(_trimNum(y)).not.toEqual(y);
      expect(_trimNum(w)).not.toEqual(w);
      expect(_trimNum(h)).not.toEqual(h);
      let r = svg.rect(w, h);
      r.attr({ 'x': x, 'y': y });
      let ros = _rectOptions(r);
      expect(_trimNum(ros.x)).toEqual(ros.x);
      expect(_trimNum(ros.y)).toEqual(ros.y);
      expect(_trimNum(ros.w)).toEqual(ros.w);
      expect(_trimNum(ros.h)).toEqual(ros.h);
    });
  });

  it('gives correct line (and uses _pptxHex function)', () => {
    let svg = createNodeSVG();
    let r = svg.rect(40, 30);
    r.attr({
      'stroke': '#56ab32',
      'stroke-width': 3,
      'stroke-opacity': 0.45,
    });
    let ros = _rectOptions(r);
    expect(ros.line.type).toBe('solid');
    expect(ros.line.color).toBe('56AB32');
    expect(ros.line.alpha).toBeCloseTo(55, 2);
  });

  it('sets line alpha to 100 when line size is 0', () => {
    /* For some reason setting line size to 0 results in a line size
    of 0.75 pt when the PPTX file is opened in PowerPoint. Setting alpha
    to 100 keeps the line invisible. */
    let svg = createNodeSVG();
    let r = svg.rect(25);
    r.attr({ 'stroke-width': 0, 'stroke-opacity': 0.5 });
    let ros = _rectOptions(r);
    expect(ros.line.alpha).toBe(100);
  });

  describe('lineSize', () => {
    it('gives correct value', () => {
      let svg = createNodeSVG();
      let r = svg.rect(10, 40);
      r.attr({
        'stroke-width': pointsToPixels(5),
        'stroke-opacity': 0.6,
      });
      let ros = _rectOptions(r);
      expect(ros.lineSize).toBeCloseTo(5, 2);
    });

    it('trims the number', () => {
      let svg = createNodeSVG();
      let r = svg.rect(50, 20);
      let sw = 6.1948712844;
      expect(_trimNum(sw)).not.toEqual(sw);
      r.attr({ 'stroke-width': sw });
      let ros = _rectOptions(r);
      expect(_trimNum(ros.lineSize)).toEqual(ros.lineSize);
    });
  });

  it('gives correct fill (and uses _pptxHex function)', () => {
    let svg = createNodeSVG();
    let r = svg.rect(10, 20);
    r.attr({
      'fill': '#ab12cd',
      'fill-opacity': 0.8,
    });
    let ros = _rectOptions(r);
    expect(ros.fill.type).toBe('solid');
    expect(ros.fill.color).toBe('AB12CD');
    expect(ros.fill.alpha).toBeCloseTo(20, 2);
  });
});

describe('_elementImageOptions function', () => {
  it('gives correct x, y, w and h', () => {
    let svg = createNodeSVG();
    let p = svg.path('M 30 100 Q 150 200 30 300');
    p.attr({ 'stroke-width': 6 });
    let pios = _elementImageOptions(p);
    expect(pios.x).toBeCloseTo(pixelsToInches(27), 2);
    expect(pios.y).toBeCloseTo(pixelsToInches(97), 2);
    expect(pios.w).toBeCloseTo(pixelsToInches(66), 2);
    expect(pios.h).toBeCloseTo(pixelsToInches(206), 2);
  });

  it('handles non-number stroke-width', () => {
    let svg = createNodeSVG();
    let p = svg.path('M 300 150 Q 1000 2000 800 450');
    p.attr({ 'stroke-width': '8px' }); // not a number
    expect(typeof p.attr('stroke-width')).not.toBe('number');
    let pios = _elementImageOptions(p);
    expect(typeof pios.x).toBe('number');
    expect(Number.isFinite(pios.x)).toBeTruthy();
    expect(typeof pios.y).toBe('number');
    expect(Number.isFinite(pios.y)).toBeTruthy();
    expect(typeof pios.w).toBe('number');
    expect(Number.isFinite(pios.w)).toBeTruthy();
    expect(typeof pios.h).toBe('number');
    expect(Number.isFinite(pios.h)).toBeTruthy();
  });

  it('handles nonfinite stroke-width', () => {
    let svg = createNodeSVG();
    let p = svg.path('M 300 150 Q 1000 2000 800 450');
    p.attr({ 'stroke-width': NaN }); // nonfinite
    let pios = _elementImageOptions(p);
    expect(typeof pios.x).toBe('number');
    expect(Number.isFinite(pios.x)).toBeTruthy();
    expect(typeof pios.y).toBe('number');
    expect(Number.isFinite(pios.y)).toBeTruthy();
    expect(typeof pios.w).toBe('number');
    expect(Number.isFinite(pios.w)).toBeTruthy();
    expect(typeof pios.h).toBe('number');
    expect(Number.isFinite(pios.h)).toBeTruthy();
  });

  it('gives correct data', () => {
    let svg = createNodeSVG();
    let p = svg.path('M 100 2 Q 1 200 100 400');
    p.attr({
      'stroke': '#ff0000',
      'stroke-width': 5,
      'fill-opacity': 0,
    });
    let pios = _elementImageOptions(p);
    expect(pios.data).toBe('data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpzdmdqcz0iaHR0cDovL3N2Z2pzLmNvbS9zdmdqcyIgdmlld0JveD0iMCAwIDU0LjUwMDAwMDAwMDAwMDAxIDQwMyIgd2lkdGg9IjU0LjUwMDAwMDAwMDAwMDAxIiBoZWlnaHQ9IjQwMyI+PHBhdGggZD0iTTUyLjAwMDAwMDAwMDAwMDAxIDIuNVEtNDYuOTk5OTk5OTk5OTk5OTkgMjAwLjUgNTIuMDAwMDAwMDAwMDAwMDEgNDAwLjUgIiBzdHJva2U9IiNmZjAwMDAiIHN0cm9rZS13aWR0aD0iNSIgZmlsbC1vcGFjaXR5PSIwIj48L3BhdGg+PC9zdmc+');
  });

  it('nested SVG document is removed', () => {
    let svg = createNodeSVG();
    svg.viewbox(2, 10, 120, 140);
    svg.attr({ 'width': 200, 'height': 250 });
    let p = svg.path('M 4 15 Q 80 90 4 165');
    p.id();
    p.dmove(0, 0);
    expect(svg.children().length).toBe(2);
    expect(svg.findOne('#' + p.id()).id()).toBe(p.id());
    _elementImageOptions(p);
    expect(svg.children().length).toBe(2);
    expect(svg.findOne('#' + p.id()).id()).toBe(p.id());
  });

  it('trims numbers', () => {
    let svg = createNodeSVG();
    let mx = 5.12984712814;
    let my = 7.19871824748;
    let qcx = 10.2384418244;
    let qcy = 40.129481724;
    let qex = 3.12984712847;
    let qey = 80.198472814;
    expect(_trimNum(mx)).not.toEqual(mx);
    expect(_trimNum(my)).not.toEqual(my);
    expect(_trimNum(qcx)).not.toEqual(qcx);
    expect(_trimNum(qcy)).not.toEqual(qcy);
    expect(_trimNum(qex)).not.toEqual(qex);
    expect(_trimNum(qey)).not.toEqual(qey);
    let d = ['M', mx, my, 'Q', qcx, qcy, qex, qey].join(' ');
    let p = svg.path(d);
    let pios = _elementImageOptions(p);
    expect(_trimNum(pios.x)).toEqual(pios.x);
    expect(_trimNum(pios.y)).toEqual(pios.y);
    expect(_trimNum(pios.w)).toEqual(pios.w);
    expect(_trimNum(pios.h)).toEqual(pios.h);
  });
});

describe('createPptxFromSvg function', () => {
  it('sets slide dimensions (and trims numbers)', () => {
    let svg = createNodeSVG();
    svg.viewbox(0, 0, 800, 500);
    let pres = createPptxFromSvg(svg);
    return pres.write('blob').then(data => {
      let expectedData = fs.readFileSync('testinput/pptx/sets_slide_dimensions_blob');
      expect(data.toString()).toBe(expectedData.toString());
    });
  });

  it('adds texts and lines', () => {
    let svg = createNodeSVG();
    svg.viewbox(0, 0, 800, 800);
    let t = svg.text(add => add.tspan('A'));
    t.attr({
      'x': 60,
      'y': 80,
      'fill': '#ff0000',
      'font-size': 20,
      'font-family': 'Arial',
      'font-weight': 'bold',
    });
    let l = svg.line(60, 80, 400, 300);
    l.attr({
      'stroke': '#0000ff',
      'stroke-width': 10,
    });
    let pres = createPptxFromSvg(svg);
    return pres.write('blob').then(data => {
      let expectedData = fs.readFileSync('testinput/pptx/adds_texts_and_lines_blob');
      expect(data.toString()).toBe(expectedData.toString());
    });
  });

  it('adds circles and rects', () => {
    let svg = createNodeSVG();
    svg.viewbox(0, 0, 800, 800);
    let c = svg.circle(100);
    c.attr({
      'cx': 400,
      'cy': 400,
      'fill': '#00ff00',
      'stroke-opacity': 0,
    });
    let r = svg.rect(200, 100);
    r.attr({
      'x': 600,
      'y': 700,
      'stroke': '888888',
      'stroke-width': 20,
      'fill-opacity': 0,
    });
    let pres = createPptxFromSvg(svg);
    return pres.write('blob').then(data => {
      let expectedData = fs.readFileSync('testinput/pptx/adds_circles_and_rects_blob');
      expect(data.toString()).toBe(expectedData.toString());
    });
  });

  it('adds path elements', () => {
    let svg = createNodeSVG();
    svg.viewbox(0, 0, 1000, 1000);
    let p = svg.path('M 100 100 Q 800 750 200 400');
    p.attr({
      'stroke': '#004400',
      'stroke-width': 8,
      'fill-opacity': 0,
    });
    let pres = createPptxFromSvg(svg);
    // TODO: stop the following from stalling...
    /*
    return pres.write('nodebuffer').then(data => {
      fs.writeFile('testinput/pptx/path_is_not_just_lines_nodebuffer.pptx', data, () => {});
    });
    */
  });
});
