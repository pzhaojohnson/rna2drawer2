import {
  createPPTXfromSVG,
  _NUMBER_TRIM,
  _trimNum,
  _xTextCenter,
  _yTextCenter,
  _textOptions,
  _lineOptions,
  _circleOptions,
} from './createPPTXfromSVG';
import { trimNum } from './trimNum';
import createNodeSVG from '../draw/createNodeSVG';
const fs = require('fs');
import { pixelsToPoints } from './pixelsToPoints';
import { pixelsToInches } from './pixelsToInches';
import { pointsToPixels } from './pointsToPixels';
import { pointsToInches } from './pointsToInches';

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
});

describe('_lineOptions function', () => {
  describe('x, y, w and h', () => {
    it('flipped horizontally and not flipped vertically', () => {
      let svg = createNodeSVG();
      let l = svg.line(120, 15, 20, 75);
      let los = _lineOptions(l);
      expect(los.x).toBeCloseTo(pixelsToInches(120), 2);
      expect(los.y).toBeCloseTo(pixelsToInches(15), 2);
      expect(los.w).toBeCloseTo(pixelsToInches(100), 2);
      expect(los.h).toBeCloseTo(pixelsToInches(60), 2);
    });

    it('not flipped horizontally and flipped vertically', () => {
      let svg = createNodeSVG();
      let l = svg.line(70, 250, 190, 90);
      let los = _lineOptions(l);
      expect(los.x).toBeCloseTo(pixelsToInches(70), 2);
      expect(los.y).toBeCloseTo(pixelsToInches(250), 2);
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

  it('line and lineSize', () => {
    let svg = createNodeSVG();
    let l = svg.line(1, 3, 5, 7);
    l.attr({
      'stroke': 'aabbcc',
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

describe('_circleOptions function', () => {
  describe('x, y, w and h', () => {
    it('gives correct values', () => {});

    it('trims numbers', () => {});
  });

  it('gives correct line', () => {});

  describe('lineSize', () => {
    it('stroke-opacity is greater than zero', () => {});

    it('stroke-opacity is zero', () => {});

    it('trims number', () => {});
  });

  it('gives correct fill', () => {
    let svg = createNodeSVG();
    let c = svg.circle(20);
    c.attr({
      'fill': '#998877',
      'fill-opacity': 0.3,
    });
    let cos = _circleOptions(c);
    expect(cos.fill.type).toBe('solid');
    expect(cos.fill.color).toBe('#998877');
    expect(cos.fill.alpha).toBeCloseTo(30, 2);
  });
});

describe('createPPTXfromSVG function', () => {
  it('sets slide dimensions (and trims numbers)', () => {
    let svg = createNodeSVG();
    svg.viewbox(0, 0, 800, 500);
    let pres = createPPTXfromSVG(svg);
    return pres.write('blob').then(data => {
      let expectedData = fs.readFileSync('testinput/pptx/sets_slide_dimensions_blob', 'utf8');
      expect(data.toString()).toBe(expectedData.toString());
    });
  });
});
