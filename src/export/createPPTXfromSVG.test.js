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
import { NodeSVG } from 'Draw/svg/NodeSVG';
const fs = require('fs');
import { pixelsToPoints } from './pixelsToPoints';
import { pixelsToInches } from './pixelsToInches';
import { pointsToPixels } from './pointsToPixels';
import { pointsToInches } from './pointsToInches';
import PptxGenJs from 'pptxgenjs';
import * as Svg from '@svgdotjs/svg.js';
import { parseColor } from 'Parse/parseColor';

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
      let svg = NodeSVG();
      let t = svg.text(add => add.tspan('T'));
      t.attr({ 'font-size': pointsToPixels(20) });
      let tos = _textOptions(t);
      expect(tos.fontSize).toBeCloseTo(20, 2);
      expect(tos.w).toBeCloseTo(0.46, 2);
      expect(tos.h).toBeCloseTo(0.95, 2);
    });

    it('trims numbers', () => {
      let svg = NodeSVG();
      let t = svg.text(add => add.tspan('Y'));
      let fs = 12.2339587128947;
      expect(_trimNum(fs)).not.toEqual(fs);
      t.attr({ 'font-size': fs });
      let tos = _textOptions(t);
      expect(_trimNum(tos.fontSize)).toEqual(tos.fontSize);
      expect(trimNum(tos.w, 4)).toEqual(tos.w);
      expect(trimNum(tos.h, 4)).toEqual(tos.h);
    });
  });

  describe('x and y', () => {
    it('gives correct values', () => {
      let svg = NodeSVG();
      let t = svg.text(add => add.tspan('A'));
      t.attr({
        'x': 50,
        'y': 100,
        'font-size': pointsToPixels(12),
      });
      let tos = _textOptions(t);
      expect(tos.x).toBeCloseTo(0.42, 2);
      expect(tos.y).toBeCloseTo(0.69, 2);
    });

    it('trims numbers', () => {
      let svg = NodeSVG();
      let x = 6.19847129847;
      let y = 7.1893781257;
      let t = svg.text(add => add.tspan('Y'));
      t.attr({ 'x': x, 'y': y });
      let tos = _textOptions(t);
      expect(trimNum(tos.x, 4)).toEqual(tos.x);
      expect(trimNum(tos.y, 4)).toEqual(tos.y);
    });
  });

  describe('bold', () => {
    it('font-weight is normal, bold, bolder, 400 or 700', () => {
      let svg = NodeSVG();
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
    let svg = NodeSVG();
    let t = svg.text(add => add.tspan('A'));
    t.attr({ 'font-family': 'Consolas' });
    let tos = _textOptions(t);
    expect(tos.fontFace).toBe('Consolas');
    expect(tos.align).toBe('center');
    expect(tos.valign).toBe('middle');
  });

  it('gives correct color (and uses _pptxHex function', () => {
    let svg = NodeSVG();
    let t = svg.text(add => add.tspan('A'));
    t.attr({ 'fill': '#152637' });
    let tos = _textOptions(t);
    expect(tos.color).toBe('152637');
  });

  it('handles undefined fill', () => {
    let svg = NodeSVG();
    let t = svg.text(add => add.tspan('R'));
    t.attr({ 'fill': null });
    // doesn't seem to actually be possible
    // to make fill falsy
    //expect(t.attr('fill')).toBeFalsy();
    let tos;
    expect(() => tos = _textOptions(t)).not.toThrow();
    expect(tos.color).toBe('000000'); // seems to default to black
  });
});

describe('_lineOptions function', () => {
  describe('x, y, w and h', () => {
    it('flipped horizontally and not flipped vertically', () => {
      let svg = NodeSVG();
      let l = svg.line(120, 15, 20, 75);
      let los = _lineOptions(l);
      expect(los.x).toBeCloseTo(pixelsToInches(20), 2);
      expect(los.y).toBeCloseTo(pixelsToInches(15), 2);
      expect(los.w).toBeCloseTo(pixelsToInches(100), 2);
      expect(los.h).toBeCloseTo(pixelsToInches(60), 1);
    });

    it('not flipped horizontally and flipped vertically', () => {
      let svg = NodeSVG();
      let l = svg.line(70, 250, 190, 90);
      let los = _lineOptions(l);
      expect(los.x).toBeCloseTo(pixelsToInches(70), 2);
      expect(los.y).toBeCloseTo(pixelsToInches(90), 2);
      expect(los.w).toBeCloseTo(pixelsToInches(120), 2);
      expect(los.h).toBeCloseTo(pixelsToInches(160), 2);
    });

    it('trims numbers', () => {
      let svg = NodeSVG();
      let x1 = 5.198471284;
      let y1 = 6.1841289414;
      let x2 = 12.2358738471;
      let y2 = 5.12984712847;
      let l = svg.line(x1, y1, x2, y2);
      let los = _lineOptions(l);
      expect(trimNum(los.x, 4)).toEqual(los.x);
      expect(trimNum(los.y, 4)).toEqual(los.y);
      expect(trimNum(los.w, 4)).toEqual(los.w);
      expect(trimNum(los.h, 4)).toEqual(los.h);
    });
  });

  describe('flipH and flipV', () => {
    it('flipped horizontally and not flipped vertically', () => {
      let svg = NodeSVG();
      let l = svg.line(100, 8, 20, 40);
      let los = _lineOptions(l);
      expect(los.flipH).toBe(true);
      expect(los.flipV).toBe(false);
    });

    it('not flipped horizontally and flipped vertically', () => {
      let svg = NodeSVG();
      let l = svg.line(30, 200, 90, 120);
      let los = _lineOptions(l);
      expect(los.flipH).toBe(false);
      expect(los.flipV).toBe(true);
    });
  });

  it('line color and width (and uses _pptxHex function)', () => {
    let svg = NodeSVG();
    let l = svg.line(1, 3, 5, 7);
    l.attr({
      'stroke': '#aabbcc',
      'stroke-width': pointsToPixels(2),
    });
    let los = _lineOptions(l);
    expect(los.line.color).toBe('AABBCC');
    expect(los.line.width).toBeCloseTo(2, 2);
  });

  it('handles undefined stroke', () => {
    let svg = NodeSVG();
    let l = svg.line(1, 2, 5, 6);
    l.attr({ 'stroke': null });
    // does not seem to actually be possible
    // to make stroke falsy
    //expect(l.attr('stroke')).toBeFalsy();
    let los;
    expect(() => los = _lineOptions(l)).not.toThrow();
    expect(los.line.color).toBe('000000'); // seems to default to black
  });

  it('trims line width', () => {
    let svg = NodeSVG();
    let l = svg.line(2, 4, 6, 8);
    let sw = 2.23938471298;
    expect(_trimNum(sw)).not.toEqual(sw);
    l.attr({ 'stroke-width': sw });
    let los = _lineOptions(l);
    expect(_trimNum(los.line.width)).toEqual(los.line.width);
  });
});

describe('_circleOptions function', () => {
  describe('x, y, w and h', () => {
    it('gives correct values', () => {
      let svg = NodeSVG();
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
      let svg = NodeSVG();
      let d = 6.12481724871;
      let cx = 6.12984718247;
      let cy = 8.39857128471;
      let c = svg.circle(d);
      c.attr({ 'cx': cx, 'cy': cy });
      let cos = _circleOptions(c);
      expect(trimNum(cos.x, 4)).toEqual(cos.x);
      expect(trimNum(cos.y, 4)).toEqual(cos.y);
      expect(trimNum(cos.w, 4)).toEqual(cos.w);
      expect(trimNum(cos.h, 4)).toEqual(cos.h);
    });
  });

  describe('line', () => {
    it('gives correct color, width and transparency', () => {
      let svg = NodeSVG();
      let c = svg.circle(20);
      c.attr({
        'stroke': '#11ab35',
        'stroke-width': pointsToPixels(5),
        'stroke-opacity': 0.25,
      });
      let cos = _circleOptions(c);
      // converted to PPTX compatible hex code
      expect(cos.line.color).toBe('11AB35');
      expect(cos.line.width).toBeCloseTo(5);
      expect(cos.line.transparency).toBeCloseTo(75);
    });

    it('trims width', () => {
      let svg = NodeSVG();
      let c = svg.circle(50);
      c.attr({ 'stroke-width': 5.192847191941 }); // needs trimming
      let cos = _circleOptions(c);
      expect(cos.line.width).toBe(_trimNum(cos.line.width));
    });

    it('leaves undefined when line is invisible', () => {
      // line must be left undefined since a width of zero
      // or transparency of 100 may end up being changed in
      // the resulting PPTX file so that the line is visible
      // for some reason...
      let svg = NodeSVG();
      let c = svg.circle(20);
      c.attr({ 'stroke': '#abcdef' });
      c.attr({ 'stroke-width': 0, 'stroke-opacity': 0.5 });
      let cos = _circleOptions(c);
      expect(cos.line).toBeFalsy();
      c.attr({ 'stroke-width': 2, 'stroke-opacity': 0 });
      cos = _circleOptions(c);
      expect(cos.line).toBeFalsy();
    });

    it('handles undefined stroke', () => {
      let svg = NodeSVG();
      let c = svg.circle(10);
      c.attr({ 'stroke': null, 'stroke-width': 1 });
      // does not seem to actually be possible
      // to make stroke falsy
      expect(c.attr('stroke')).toBe('#000000'); // defaults to black
      let cos;
      expect(() => cos = _circleOptions(c)).not.toThrow();
      expect(cos.line.color).toBe('000000');
    });
  });

  describe('fill', () => {
    it('gives correct color and transparency', () => {
      let svg = NodeSVG();
      let c = svg.circle(15);
      c.attr({ fill: '#11ba3d', 'fill-opacity': 0.4 });
      let cos = _circleOptions(c);
      // converted to PPTX compatible hex code
      expect(cos.fill.color).toBe('11BA3D');
      expect(cos.fill.transparency).toBeCloseTo(60);
    });

    it('leaves undefined when invisible', () => {
      // fill must be left undefined since a transparency
      // of 100 may end up being changed in the resulting
      // PPTX file so that the fill is visible for some
      // reason...
      let svg = NodeSVG();
      let c = svg.circle(10);
      c.attr({ 'fill': '#abcd11', 'fill-opacity': 0 });
      let cos = _circleOptions(c);
      expect(cos.fill).toBeFalsy();
    });

    it('handles undefined fill', () => {
      let svg = NodeSVG();
      let c = svg.circle(50);
      c.attr({ 'fill': null });
      // does not seem to actually be possible
      // to make fill falsy
      expect(c.attr('fill')).toBe('#000000'); // defaults to black
      let cos;
      expect(() => cos = _circleOptions(c)).not.toThrow();
      expect(cos.fill.color).toBe('000000');
    });
  });
});

describe('_rectOptions function', () => {
  describe('x, y, w and h', () => {
    it('gives correct values', () => {
      let svg = NodeSVG();
      let r = svg.rect(110, 70);
      r.attr({ 'x': 20, 'y': 200 });
      let ros = _rectOptions(r);
      expect(ros.x).toBeCloseTo(pixelsToInches(20), 2);
      expect(ros.y).toBeCloseTo(pixelsToInches(200), 2);
      expect(ros.w).toBeCloseTo(pixelsToInches(110), 2);
      expect(ros.h).toBeCloseTo(pixelsToInches(70), 2);
    });

    it('trims numbers', () => {
      let svg = NodeSVG();
      let x = 6.1984719247;
      let y = 12.29857387;
      let w = 56.1298471847;
      let h = 100.23857387;
      let r = svg.rect(w, h);
      r.attr({ 'x': x, 'y': y });
      let ros = _rectOptions(r);
      expect(trimNum(ros.x, 4)).toEqual(ros.x);
      expect(trimNum(ros.y, 4)).toEqual(ros.y);
      expect(trimNum(ros.w, 4)).toEqual(ros.w);
      expect(trimNum(ros.h, 4)).toEqual(ros.h);
    });
  });

  describe('line', () => {
    it('gives correct color, width and transparency', () => {
      let svg = NodeSVG();
      let r = svg.rect(20, 10);
      r.attr({
        'stroke': '#1eab36',
        'stroke-width': pointsToPixels(4.5),
        'stroke-opacity': 0.35,
      });
      let ros = _rectOptions(r);
      // converted to PPTX compatible hex code
      expect(ros.line.color).toBe('1EAB36');
      expect(ros.line.width).toBeCloseTo(4.5);
      expect(ros.line.transparency).toBeCloseTo(65);
    });

    it('trims width', () => {
      let svg = NodeSVG();
      let r = svg.rect(50, 50);
      r.attr({ 'stroke-width': 5.192847191941 }); // needs trimming
      let ros = _rectOptions(r);
      expect(ros.line.width).toBe(_trimNum(ros.line.width));
    });

    it('leaves undefined when line is invisible', () => {
      // line must be left undefined since a width of zero
      // or transparency of 100 may end up being changed in
      // the resulting PPTX file so that the line is visible
      // for some reason...
      let svg = NodeSVG();
      let r = svg.rect(10, 20);
      r.attr({ 'stroke': '#abcdef' });
      r.attr({ 'stroke-width': 0, 'stroke-opacity': 0.5 });
      let ros = _rectOptions(r);
      expect(ros.line).toBeFalsy();
      r.attr({ 'stroke-width': 2, 'stroke-opacity': 0 });
      ros = _rectOptions(r);
      expect(ros.line).toBeFalsy();
    });

    it('handles undefined stroke', () => {
      let svg = NodeSVG();
      let r = svg.rect(10, 5);
      r.attr({ 'stroke': null, 'stroke-width': 1 });
      // does not seem to actually be possible
      // to make stroke falsy
      expect(r.attr('stroke')).toBe('#000000'); // defaults to black
      let ros;
      expect(() => ros = _rectOptions(r)).not.toThrow();
      expect(ros.line.color).toBe('000000');
    });
  });

  describe('fill', () => {
    it('gives correct color and transparency', () => {
      let svg = NodeSVG();
      let r = svg.rect(15, 12);
      r.attr({ fill: '#21ba88', 'fill-opacity': 0.41 });
      let ros = _rectOptions(r);
      // converted to PPTX compatible hex code
      expect(ros.fill.color).toBe('21BA88');
      expect(ros.fill.transparency).toBeCloseTo(59);
    });

    it('leaves undefined when invisible', () => {
      // fill must be left undefined since a transparency
      // of 100 may end up being changed in the resulting
      // PPTX file so that the fill is visible for some
      // reason...
      let svg = NodeSVG();
      let r = svg.rect(2, 10);
      r.attr({ 'fill': '#abcd11', 'fill-opacity': 0 });
      let ros = _rectOptions(r);
      expect(ros.fill).toBeFalsy();
    });

    it('handles undefined fill', () => {
      let svg = NodeSVG();
      let r = svg.rect(5, 20);
      r.attr({ 'fill': null });
      // does not seem to actually be possible
      // to make fill falsy
      expect(r.attr('fill')).toBe('#000000'); // defaults to black
      let ros;
      expect(() => ros = _rectOptions(r)).not.toThrow();
      expect(ros.fill.color).toBe('000000');
    });
  });
});

describe('_elementImageOptions function', () => {
  it('gives correct x, y, w and h', () => {
    let svg = NodeSVG();
    let p = svg.path('M 30 100 Q 150 200 30 300');
    p.attr({ 'stroke-width': 6 });
    let pios = _elementImageOptions(p);
    expect(pios.x).toBeCloseTo(pixelsToInches(27), 2);
    expect(pios.y).toBeCloseTo(pixelsToInches(97), 2);
    expect(pios.w).toBeCloseTo(pixelsToInches(66), 2);
    expect(pios.h).toBeCloseTo(pixelsToInches(206), 2);
  });

  it('handles non-number stroke-width', () => {
    let svg = NodeSVG();
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
    let svg = NodeSVG();
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
    let svg = NodeSVG();
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
    let svg = NodeSVG();
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
    let svg = NodeSVG();
    let mx = 5.12984712814;
    let my = 7.19871824748;
    let qcx = 10.2384418244;
    let qcy = 40.129481724;
    let qex = 3.12984712847;
    let qey = 80.198472814;
    let d = ['M', mx, my, 'Q', qcx, qcy, qex, qey].join(' ');
    let p = svg.path(d);
    let pios = _elementImageOptions(p);
    expect(trimNum(pios.x, 4)).toEqual(pios.x);
    expect(trimNum(pios.y, 4)).toEqual(pios.y);
    expect(trimNum(pios.w, 4)).toEqual(pios.w);
    expect(trimNum(pios.h, 4)).toEqual(pios.h);
  });

  it('returns undefined for elements with zero area', () => {
    // attempting to export a PPTX file with an image of zero area
    // seems to cause an error
    let svg = NodeSVG();
    let c = svg.circle(0);
    // width and height of zero
    c.attr({ 'r': 0, 'stroke-width': 0, 'cx': 100, 'cy': 200 });
    let r1 = svg.rect(0, 20);
    // width of zero
    r1.attr({ 'width': 0, 'height': 20, 'stroke-width': 0, 'x': 35, 'y': 75 });
    let r2 = svg.rect(11, 0);
    // height of zero
    r2.attr({ 'width': 11, 'height': 0, 'stroke-width': 0, 'x': 100, 'y': 200 });
    expect(_elementImageOptions(c)).toBe(undefined);
    expect(_elementImageOptions(r1)).toBe(undefined);
    expect(_elementImageOptions(r2)).toBe(undefined);
  });
});

describe('createPptxFromSvg function', () => {
  it('sets slide dimensions (and trims numbers)', () => {
    let svg = NodeSVG();
    svg.viewbox(0, 0, 800, 500);
    let pres = createPptxFromSvg(svg);
    return pres.write('blob').then(data => {
      let expectedData = fs.readFileSync('testinput/pptx/sets_slide_dimensions_blob');
      expect(data.toString()).toBe(expectedData.toString());
    });
  });

  it('adds texts and lines', () => {
    let svg = NodeSVG();
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
    let svg = NodeSVG();
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
    // doesn't seem possible to write PPTX files
    // in Node environment when adding circles
    // and rects as images (as is also an issue
    // when adding paths as images in the test
    // below)
    /*
    return pres.write('blob').then(data => {
      let expectedData = fs.readFileSync('testinput/pptx/adds_circles_and_rects_blob');
      expect(data.toString()).toBe(expectedData.toString());
    });
    */
  });

  it('adds path elements', () => {
    let svg = NodeSVG();
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

  it('does not throw for other elements', () => {
    let svg = NodeSVG();
    svg.defs(); // add defs element
    expect(svg.svg()).toMatch(/defs/); // has defs element
    let pres = createPptxFromSvg(svg);
    expect(() => {
      pres.write('blob').then(data => {});
    }).not.toThrow();
  });
});
