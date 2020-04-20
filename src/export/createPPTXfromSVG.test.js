import {
  createPPTXfromSVG,
  _pptxHex,
  _NUMBER_TRIM,
  _trimNum,
  _xTextCenter,
  _yTextCenter,
  _textOptions,
  _lineOptions,
  _pathIsOnlyLines,
  _pathLineOptions,
  _linesPathOptions,
  _pathImageOptions,
  _circleOptions,
  _rectOptions,
} from './createPPTXfromSVG';
import { trimNum } from './trimNum';
import createNodeSVG from '../draw/createNodeSVG';
const fs = require('fs');
import { pixelsToPoints } from './pixelsToPoints';
import { pixelsToInches } from './pixelsToInches';
import { pointsToPixels } from './pointsToPixels';
import { pointsToInches } from './pointsToInches';
import PptxGenJs from 'pptxgenjs';

describe('_pptxHex function', () => {
  describe('given hex code is a string', () => {
    it("starts with '#'", () => {
      expect(_pptxHex('#a1b5c8')).toBe('a1b5c8');
    });

    it("does not start with '#'", () => {
      expect(_pptxHex('198237')).toBe('198237');
    });
  });

  it('given hex code is a number', () => {
    expect(_pptxHex(986532)).toBe('986532');
  });

  it('given hex code is neither a string nor number', () => {
    expect(_pptxHex(undefined)).toBe('000000');
  });
});

it('_trimNum function', () => {
  let n = 7.1298471294;
  let trimmed = trimNum(n, _NUMBER_TRIM);
  expect(trimmed).not.toEqual(n);
  expect(_trimNum(n)).toEqual(trimmed);
});

describe('_xTextCenter function', () => {
  describe('resets text-anchor', () => {
    it('text-anchor was undefined', () => {
      let svg = createNodeSVG();
      let t = svg.text(add => add.tspan('a'));
      _xTextCenter(t);
      expect(t.attr('text-anchor')).toBe('start');
    });

    it('text-anchor was end', () => {
      let svg = createNodeSVG();
      let t = svg.text(add => add.tspan('A'));
      t.attr({ 'text-anchor': 'end' });
      _xTextCenter(t);
      expect(t.attr('text-anchor')).toBe('end');
    });
  });

  it('gives correct value', () => {
    let svg = createNodeSVG();
    let t = svg.text(add => add.tspan('G'));
    t.attr({
      'x': 5,
      'font-size': 20,
      'text-anchor': 'middle',
    });
    let cxPrev = t.bbox().cx;
    t.attr({ 'text-anchor': 'end' });
    let cx = 5 + (t.bbox().cx - cxPrev);
    expect(_xTextCenter(t)).toBeCloseTo(cx, 3);
  });
});

describe('_yTextCenter function', () => {
  describe('resets dominant-baseline', () => {
    it('dominant-baseline was undefined', () => {
      let svg = createNodeSVG();
      let t = svg.text(add => add.tspan('A'));
      expect(t.attr('dominant-baseline')).toBe(undefined);
      _yTextCenter(t);
      expect(t.attr('dominant-baseline')).toBe('auto');
    });

    it('dominant-baseline was hanging', () => {
      let svg = createNodeSVG();
      let t = svg.text(add => add.tspan('G'));
      t.attr({ 'dominant-baseline': 'hanging' });
      _yTextCenter(t);
      expect(t.attr('dominant-baseline')).toBe('hanging');
    });
  });

  it('gives correct value', () => {
    let svg = createNodeSVG();
    let t = svg.text(add => add.tspan('T'));
    t.attr({
      'y': 30,
      'font-size': 12,
      'dominant-baseline': 'middle',
    });
    let cyPrev = t.bbox().cy;
    t.attr({ 'dominant-baseline': 'hanging' });
    let cy = 30 + (t.bbox().cy - cyPrev);
    expect(_yTextCenter(t)).toBeCloseTo(cy, 3);
  });
});

describe('_textOptions function', () => {
  describe('font-size, w and h', () => {
    it('gives correct values', () => {
      let svg = createNodeSVG();
      let t = svg.text(add => add.tspan('T'));
      t.attr({ 'font-size': pointsToPixels(20) });
      let tos = _textOptions(t);
      expect(tos.fontSize).toBeCloseTo(20, 2);
      expect(tos.w).toBeCloseTo(pointsToInches(30), 2);
      expect(tos.h).toBeCloseTo(pointsToInches(30), 2);
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
      let cx = _xTextCenter(t);
      let cy = _yTextCenter(t);
      let x = pixelsToInches(cx) - pointsToInches(9);
      let y = pixelsToInches(cy) - pointsToInches(9);
      let tos = _textOptions(t);
      expect(tos.x).toBeCloseTo(x, 2);
      expect(tos.y).toBeCloseTo(y, 2);
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
      expect(los.h).toBeCloseTo(pixelsToInches(60), 2);
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
    expect(los.line).toBe('aabbcc');
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

describe('_pathIsOnlyLines function', () => {
  it('fill-opacity is greater than zero and is only lines', () => {
    let svg = createNodeSVG();
    let p = svg.path('M 3 4 L 6 8');
    p.attr({ 'fill-opacity': 0.5 });
    expect(_pathIsOnlyLines(p)).toBeFalsy();
  });

  it('fill-opacity is zero and is only lines', () => {
    let svg = createNodeSVG();
    let p = svg.path('M 1 3 L 6 9 L 20 1');
    p.attr({ 'fill-opacity': 0 });
    expect(_pathIsOnlyLines(p)).toBeTruthy();
  });

  it('fill-opacity is zero and is not just lines', () => {
    let svg = createNodeSVG();
    let p = svg.path('M 1 2 Q 10 12 5 9');
    p.attr({ 'fill-opacity': 0 });
    expect(_pathIsOnlyLines(p)).toBeFalsy();
  });
});

describe('_pathLineOptions function', () => {
  describe('x, y, w, h, flipH and flipV', () => {
    it('is flippped horizontally', () => {
      let svg = createNodeSVG();
      let p = svg.path('M 120 30 L 100 200');
      let plos = _pathLineOptions(p, 120, 30, 100, 200);
      expect(plos.x).toBeCloseTo(pixelsToInches(100), 2);
      expect(plos.y).toBeCloseTo(pixelsToInches(30), 2);
      expect(plos.w).toBeCloseTo(pixelsToInches(20), 2);
      expect(plos.h).toBeCloseTo(pixelsToInches(170), 2);
      expect(plos.flipH).toBe(true);
      expect(plos.flipV).toBe(false);
    });

    it('is flipped vertically', () => {
      let svg = createNodeSVG();
      let p = svg.path('M 40 1000 L 80 800');
      let plos = _pathLineOptions(p, 40, 1000, 80, 800);
      expect(plos.x).toBeCloseTo(pixelsToInches(40), 2);
      expect(plos.y).toBeCloseTo(pixelsToInches(800), 2);
      expect(plos.w).toBeCloseTo(pixelsToInches(40), 2);
      expect(plos.h).toBeCloseTo(pixelsToInches(200), 2);
      expect(plos.flipH).toBe(false);
      expect(plos.flipV).toBe(true);
    });

    it('trims numbers', () => {
      let svg = createNodeSVG();
      let x1 = 4.128418247;
      let y1 = 6.12948712847;
      let x2 = 10.847128474;
      let y2 = 20.23987238753;
      expect(_trimNum(x1)).not.toEqual(x1);
      expect(_trimNum(y1)).not.toEqual(y1);
      expect(_trimNum(x2)).not.toEqual(x2);
      expect(_trimNum(y2)).not.toEqual(y2);
      let d = ['M', x1, y1, 'L', x2, y2].join(' ');
      let p = svg.path(d)
      let plos = _pathLineOptions(p, x1, y1, x2, y2);
      expect(_trimNum(plos.x)).toEqual(plos.x);
      expect(_trimNum(plos.y)).toEqual(plos.y);
      expect(_trimNum(plos.w)).toEqual(plos.w);
      expect(_trimNum(plos.h)).toEqual(plos.h);
    });
  });

  it('gives correct line (and uses _pptxHex function)', () => {
    let svg = createNodeSVG();
    let p = svg.path('M 1 2 L 3 4');
    p.attr({ 'stroke': '#871234' });
    let plos = _pathLineOptions(p);
    expect(plos.line).toBe('871234');
  });

  describe('lineSize', () => {
    it('gives correct value', () => {
      let svg = createNodeSVG();
      let p = svg.path('M 1 2 L 3 4');
      p.attr({ 'stroke-width': pointsToPixels(2) });
      let plos = _pathLineOptions(p, 1, 2, 3, 4);
      expect(plos.lineSize).toBeCloseTo(2, 2);
    });

    it('trims the number', () => {
      let svg = createNodeSVG();
      let p = svg.path('M 1 2 L 3 4');
      let sw = 3.1294872412;
      expect(_trimNum(sw)).not.toEqual(sw);
      p.attr({ 'stroke-width': sw });
      let plos = _pathLineOptions(p);
      expect(_trimNum(plos.lineSize)).toEqual(plos.lineSize);
    });
  });

  describe('lineDash', () => {
    it('undefined stroke-dasharray', () => {
      let svg = createNodeSVG();
      let p = svg.path('M 1 2 L 3 4');
      expect(p.attr('stroke-dasharray')).toBe(undefined);
      let plos = _pathLineOptions(p, 1, 2, 3, 4);
      expect(plos.lineDash).toBe('solid');
    });

    it('defined stroke-dasharray', () => {
      let svg = createNodeSVG();
      let p = svg.path('M 5 6 L 100 200');
      p.attr({ 'stroke-dasharray': '3 2' });
      let plos = _pathLineOptions(p, 5, 6, 100, 200);
      expect(plos.lineDash).toBe('lgDash');
    });
  });
});

it('_linesPathOptions function', () => {
  let svg = createNodeSVG();
  let p = svg.path('M 2.5 1.2 L 10 12 L 100 25.3');
  let options = _linesPathOptions(p);
  expect(options.length).toBe(2);
  let opts1 = _pathLineOptions(p, 2.5, 1.2, 10, 12);
  expect(
    Object.keys(options[0]).length
  ).toBe(Object.keys(opts1).length);
  Object.keys(opts1).forEach(k => {
    expect(options[0][k]).toBe(opts1[k]);
  });
  let opts2 = _pathLineOptions(p, 10, 12, 100, 25.3);
  expect(
    Object.keys(options[1]).length
  ).toBe(Object.keys(opts2).length);
  Object.keys(opts2).forEach(k => {
    expect(options[1][k]).toBe(opts2[k]);
  });
});

describe('_pathImageOptions function', () => {
  it('gives correct x, y, w and h', () => {
    let svg = createNodeSVG();
    let p = svg.path('M 3 9 Q 15 20 3 31');
    let pios = _pathImageOptions(p);
    expect(pios.x).toBeCloseTo(pixelsToInches(3), 2);
    expect(pios.y).toBeCloseTo(pixelsToInches(9), 2);
    expect(pios.w).toBeCloseTo(pixelsToInches(6), 2);
    expect(pios.h).toBeCloseTo(pixelsToInches(22), 2);
  });

  it('no net change in path position', () => {
    let svg = createNodeSVG();
    svg.viewbox(2, 10, 120, 140);
    svg.attr({ 'width': 200, 'height': 250 });
    let p = svg.path('M 4 15 Q 80 90 4 165');
    _pathImageOptions(p);
    let pa = p.array();
    expect(pa.length).toBe(2);
    let m = pa[0];
    expect(m.length).toBe(3);
    expect(m[0]).toBe('M');
    expect(m[1]).toBe(4);
    expect(m[2]).toBe(15);
    let q = pa[1];
    expect(q.length).toBe(5);
    expect(q[0]).toBe('Q');
    expect(q[1]).toBe(80);
    expect(q[2]).toBe(90);
    expect(q[3]).toBe(4);
    expect(q[4]).toBe(165);
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
    let pios = _pathImageOptions(p);
    expect(_trimNum(pios.x)).toEqual(pios.x);
    expect(_trimNum(pios.y)).toEqual(pios.y);
    expect(_trimNum(pios.w)).toEqual(pios.w);
    expect(_trimNum(pios.h)).toEqual(pios.h);
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
      'stroke-opacity': 0.4,
    });
    let cos = _circleOptions(c);
    expect(cos.line.type).toBe('solid');
    expect(cos.line.color).toBe('987654');
    expect(cos.line.alpha).toBeCloseTo(60, 2);
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
      'stroke-opacity': 0.45,
    });
    let ros = _rectOptions(r);
    expect(ros.line.type).toBe('solid');
    expect(ros.line.color).toBe('56ab32');
    expect(ros.line.alpha).toBeCloseTo(55, 2);
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
    expect(ros.fill.color).toBe('ab12cd');
    expect(ros.fill.alpha).toBeCloseTo(20, 2);
  });
});

describe('createPPTXfromSVG function', () => {
  it('sets slide dimensions (and trims numbers)', () => {
    let svg = createNodeSVG();
    svg.viewbox(0, 0, 800, 500);
    let pres = createPPTXfromSVG(svg);
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
    let pres = createPPTXfromSVG(svg);
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
    let pres = createPPTXfromSVG(svg);
    return pres.write('blob').then(data => {
      let expectedData = fs.readFileSync('testinput/pptx/adds_circles_and_rects_blob');
      expect(data.toString()).toBe(expectedData.toString());
    });
  });

  describe('adds path elements', () => {
    it('path has only lines', () => {
      let svg = createNodeSVG();
      svg.viewbox(0, 0, 1200, 1200);
      let p = svg.path('M 0 0 L 100 200 L 1000 500 L 300 10 L 40 50 L 750 200');
      p.attr({
        'stroke': '#0000bb',
        'stroke-width': 5,
        'fill-opacity': 0,
      });
      let pres = createPPTXfromSVG(svg);
      return pres.write('blob').then(data => {
        let expectedData = fs.readFileSync('testinput/pptx/path_is_only_lines_blob');
        expect(data.toString()).toBe(expectedData.toString());
      });
    });

    it('path is not just lines', () => {
      let svg = createNodeSVG();
      svg.viewbox(0, 0, 1000, 1000);
      let p = svg.path('M 100 100 Q 800 750 200 400');
      p.attr({
        'stroke': '#004400',
        'stroke-width': 8,
        'fill-opacity': 0,
      });
      let pres = createPPTXfromSVG(svg);
      // TODO: stop the following from stalling...
      /*
      return pres.write('nodebuffer').then(data => {
        fs.writeFile('testinput/pptx/path_is_not_just_lines_nodebuffer.pptx', data, () => {});
      });
      */
    });
  });
});
