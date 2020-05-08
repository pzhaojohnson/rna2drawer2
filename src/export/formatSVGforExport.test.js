import {
  formatSvgForExport,
  _X_PADDING,
  _Y_PADDING,
  _xTextMin,
  _xTextMax,
  _yTextMin,
  _yTextMax,
  _shiftText,
  _shiftLine,
  _shiftPath,
  _shiftCircle,
  _shiftRect,
  _shiftElements,
  _scaleCoordinate,
  _scaleText,
  _scaleLine,
  _scalePath,
  _scaleCircle,
  _scaleRect,
  _scaleElements,
  _resetTextDominantBaselines,
  _NUMBER_TRIM,
  _trimNum,
  _trimTextNumbers,
  _trimLineNumbers,
  _trimPathNumbers,
  _trimCircleNumbers,
  _trimRectNumbers,
  _trimNumbers,
  _setDimensions,
} from './formatSvgForExport';
import createNodeSVG from '../draw/createNodeSVG';
import { nonemptySplitByWhitespace } from '../parse/nonemptySplitByWhitespace';
import { trimNum } from './trimNum';

describe('_xTextMin, _xTextMax, _yTextMin and _yTextMax functions', () => {
  it('no text elements', () => {
    let svg = createNodeSVG();
    svg.circle(100);
    expect(_xTextMin(svg)).toBe(0);
    expect(_xTextMax(svg)).toBe(0);
    expect(_yTextMin(svg)).toBe(0);
    expect(_yTextMax(svg)).toBe(0);
  });

  it('ignore non-text elements', () => {
    let svg = createNodeSVG();
    let r1 = svg.rect(50, 25);
    r1.attr({ 'x': 25, 'y': 25 });
    let t = svg.text(add => add.tspan('a'));
    t.attr({ 'x': 50, 'y': 75 });
    let r2 = svg.rect(1000, 500);
    r2.attr({ 'x': 150, 'y': 175 });
    expect(_xTextMin(svg)).toBe(50);
    expect(_xTextMax(svg)).toBe(50);
    expect(_yTextMin(svg)).toBe(75);
    expect(_yTextMax(svg)).toBe(75);
  });

  it('multiple text elements', () => {
    let svg = createNodeSVG();
    let t1 = svg.text(add => add.tspan('a'));
    t1.attr({ 'x': 50, 'y': 66 });
    let t2 = svg.text(add => add.tspan('b'));
    t2.attr({ 'x': 25, 'y': 78 });
    let t3 = svg.text(add => add.tspan('c'));
    t3.attr({ 'x': 65, 'y': 35 });
    expect(_xTextMin(svg)).toBe(25);
    expect(_xTextMax(svg)).toBe(65);
    expect(_yTextMin(svg)).toBe(35);
    expect(_yTextMax(svg)).toBe(78);
  });
});

it('_shiftText function', () => {
  let svg = createNodeSVG();
  let t = svg.text(add => add.tspan('q'));
  t.attr({ 'x': 10, 'y': 12 });
  _shiftText(t, 7, -8);
  expect(t.attr('x')).toBe(17);
  expect(t.attr('y')).toBe(4);
});

it('_shiftLine function', () => {
  let svg = createNodeSVG();
  let l = svg.line(10, 12, 18, 21);
  _shiftLine(l, 12, 19);
  expect(l.attr('x1')).toBe(22);
  expect(l.attr('y1')).toBe(31);
  expect(l.attr('x2')).toBe(30);
  expect(l.attr('y2')).toBe(40);
});

describe('_shiftPath function', () => {
  it('shifts an M segment', () => {
    let svg = createNodeSVG();
    let p = svg.path('M 1 2 L 5 8');
    _shiftPath(p, 6, 12);
    let segments = p.array();
    let m = segments[0];
    expect(m.length).toBe(3);
    expect(m[0]).toBe('M');
    expect(m[1]).toBe(7);
    expect(m[2]).toBe(14);
  });

  it('shifts an L segment', () => {
    let svg = createNodeSVG();
    let p = svg.path('M 5 5 L 8 19');
    _shiftPath(p, -2, 6);
    let segments = p.array();
    let l = segments[1];
    expect(l.length).toBe(3);
    expect(l[0]).toBe('L');
    expect(l[1]).toBe(6);
    expect(l[2]).toBe(25);
  });

  it('shifts a Q segment', () => {
    let svg = createNodeSVG();
    let p = svg.path('M 5 4 Q 3 2 8 10');
    _shiftPath(p, 10, 12);
    let segments = p.array();
    let q = segments[1];
    expect(q.length).toBe(5);
    expect(q[0]).toBe('Q');
    expect(q[1]).toBe(13);
    expect(q[2]).toBe(14);
    expect(q[3]).toBe(18);
    expect(q[4]).toBe(22);
  });

  it('shifts multiple segments', () => {
    let svg = createNodeSVG();
    let p = svg.path('M 5 3 L 8 9 L 10 12');
    _shiftPath(p, 3, 6);
    let segments = p.array();
    expect(segments.length).toBe(3);
    let m = segments[0];
    expect(m.length).toBe(3);
    expect(m[0]).toBe('M');
    expect(m[1]).toBe(8);
    expect(m[2]).toBe(9);
    let l1 = segments[1];
    expect(l1.length).toBe(3);
    expect(l1[0]).toBe('L');
    expect(l1[1]).toBe(11);
    expect(l1[2]).toBe(15);
    let l2 = segments[2];
    expect(l2.length).toBe(3);
    expect(l2[0]).toBe('L');
    expect(l2[1]).toBe(13);
    expect(l2[2]).toBe(18);
  });

  it('includes unrecognized segments', () => {
    let svg = createNodeSVG();
    let p = svg.path('M 1 4 H 12');
    _shiftPath(p, 5, 8);
    let segments = p.array();
    expect(segments.length).toBe(2);
    let m = segments[0];
    expect(m.length).toBe(3);
    expect(m[0]).toBe('M');
    expect(m[1]).toBe(6);
    expect(m[2]).toBe(12);
    let h = segments[1];
    expect(h.length).toBe(2);
    expect(h[0]).toBe('H');
    expect(h[1]).toBe(12);
  });
});

it('_shiftCircle function', () => {
  let svg = createNodeSVG();
  let c = svg.circle(100);
  c.attr({ 'cx': 12, 'cy': 48 });
  _shiftCircle(c, -10, -29);
  expect(c.attr('cx')).toBe(2);
  expect(c.attr('cy')).toBe(19);
});

it('_shiftRect function', () => {
  let svg = createNodeSVG();
  let r = svg.rect(15, 30);
  r.attr({ 'x': 23, 'y': 54 });
  _shiftRect(r, 50, -32);
  expect(r.attr('x')).toBe(73);
  expect(r.attr('y')).toBe(22);
});

describe('_shiftElements function', () => {
  it('shifts by the right amounts', () => {
    let svg = createNodeSVG();
    let t = svg.text(add => add.tspan('a'));
    t.attr({ 'x': 500, 'y': 400 });
    expect(t.attr('x')).not.toBe(_X_PADDING);
    expect(t.attr('y')).not.toBe(_Y_PADDING);
    _shiftElements(svg);
    expect(t.attr('x')).toBe(_X_PADDING);
    expect(t.attr('y')).toBe(_Y_PADDING);
  });

  it('shifts text elements', () => {
    let svg = createNodeSVG();
    let t = svg.text(add => add.tspan('b'));
    t.attr({ 'x': 55, 'y': 901 });
    expect(t.attr('x')).not.toBe(_X_PADDING);
    expect(t.attr('y')).not.toBe(_Y_PADDING);
    _shiftElements(svg);
    expect(t.attr('x')).toBe(_X_PADDING);
    expect(t.attr('y')).toBe(_Y_PADDING);
  });

  it('shifts line elements', () => {
    let svg = createNodeSVG();
    let t = svg.text(add => add.tspan('a'));
    t.attr({ 'x': _X_PADDING + 12, 'y': _Y_PADDING - 25 });
    let l = svg.line(12, 15, 200, 250);
    _shiftElements(svg);
    expect(l.attr('x1')).toBe(0);
    expect(l.attr('y1')).toBe(40);
    expect(l.attr('x2')).toBe(188);
    expect(l.attr('y2')).toBe(275);
  });

  it('shifts path elements', () => {
    let svg = createNodeSVG();
    let t = svg.text(add => add.tspan('a'));
    t.attr({ 'x': _X_PADDING - 14, 'y': _Y_PADDING + 15 });
    let p = svg.path('M 3 4 L 8 9');
    _shiftElements(svg);
    let segments = p.array();
    let m = segments[0];
    expect(m[1]).toBe(17);
    expect(m[2]).toBe(-11);
    let l = segments[1];
    expect(l[1]).toBe(22);
    expect(l[2]).toBe(-6);
  });

  it('shifts circle elements', () => {
    let svg = createNodeSVG();
    let t = svg.text(add => add.tspan('a'));
    t.attr({ 'x': _X_PADDING + 17, 'y': _Y_PADDING + 5 });
    let c = svg.circle(50);
    c.attr({ 'cx': 57, 'cy': 89 });
    _shiftElements(svg);
    expect(c.attr('cx')).toBe(40);
    expect(c.attr('cy')).toBe(84);
  });

  it('shifts rect elements', () => {
    let svg = createNodeSVG();
    let t = svg.text(add => add.tspan('a'));
    t.attr({ 'x': _X_PADDING + 40, 'y': _Y_PADDING - 6 });
    let r = svg.rect(12, 15);
    r.attr({ 'x': 15, 'y': 18 });
    _shiftElements(svg);
    expect(r.attr('x')).toBe(-25);
    expect(r.attr('y')).toBe(24);
  });
});

it('_scaleCoordinate function', () => {
  expect(_scaleCoordinate(2, 3, 4)).toBe(-2);
});

describe('_scaleText function', () => {
  it('handles undefine and string font-size', () => {
    let svg = createNodeSVG();
    let t = svg.text(add => add.tspan('a'));
    expect(t.attr('font-size')).toBe(undefined);
    expect(
      () => _scaleText(t, 3, 5, 7)
    ).not.toThrow();
    expect(t.attr('font-size')).toBe(undefined);
    t.attr({ 'font-size': 'medium' });
    expect(
      () => _scaleText(t, 3, 5, 7)
    ).not.toThrow();
    expect(t.attr('font-size')).toBe('medium');
  });

  it('scales properties', () => {
    let svg = createNodeSVG();
    let t = svg.text(add => add.tspan('b'));
    t.attr({
      'x': 3,
      'y': 4,
      'font-size': 5,
    });
    _scaleText(t, 5, 1, 6);
    expect(t.attr('x')).toBe(11);
    expect(t.attr('y')).toBe(-4);
    expect(t.attr('font-size')).toBe(25);
  });
});

it('_scaleLine function', () => {
  let svg = createNodeSVG();
  let l = svg.line(2, 4, 8, 6);
  l.attr({ 'stroke-width': 1.5 });
  _scaleLine(l, 2, -2, 4);
  expect(l.attr('x1')).toBe(6);
  expect(l.attr('y1')).toBe(4);
  expect(l.attr('x2')).toBe(18);
  expect(l.attr('y2')).toBe(8);
  expect(l.attr('stroke-width')).toBeCloseTo(3, 3);
});

describe('_scalePath function', () => {
  describe('scales path segments', () => {
    it('handles undefined path', () => {
      let svg = createNodeSVG();
      let p = svg.path();
      expect(
        () => _scalePath(p, 3, 5, 8)
      ).not.toThrow();
    });

    it('scales M, L and Q segments', () => {
      let svg = createNodeSVG();
      let p = svg.path('M 5 8 L 2 4 Q 8 9 6 7');
      _scalePath(p, 0.5, -1, 2);
      let pa = p.array();
      expect(pa.length).toBe(3);
      let m = pa[0];
      expect(m.length).toBe(3);
      expect(m[0]).toBe('M');
      expect(m[1]).toBeCloseTo(2, 3);
      expect(m[2]).toBeCloseTo(5);
      let l = pa[1];
      expect(l.length).toBe(3);
      expect(l[0]).toBe('L');
      expect(l[1]).toBeCloseTo(0.5, 3);
      expect(l[2]).toBeCloseTo(3, 3);
      let q = pa[2];
      expect(q.length).toBe(5);
      expect(q[0]).toBe('Q');
      expect(q[1]).toBeCloseTo(3.5, 3);
      expect(q[2]).toBeCloseTo(5.5, 3);
      expect(q[3]).toBeCloseTo(2.5, 3);
      expect(q[4]).toBeCloseTo(4.5, 3);
    });

    it('includes unrecognized segments', () => {
      let svg = createNodeSVG();
      let p = svg.path('M 1 2 L 4 5 H 20');
      _scalePath(p, 2, 4, 6);
      let pa = p.array();
      expect(pa.length).toBe(3);
      let m = pa[0];
      expect(m.length).toBe(3);
      expect(m[0]).toBe('M');
      expect(m[1]).toBe(-2);
      expect(m[2]).toBe(-2);
      let l = pa[1];
      expect(l.length).toBe(3);
      expect(l[0]).toBe('L');
      expect(l[1]).toBe(4);
      expect(l[2]).toBe(4);
      let h = pa[2];
      expect(h.length).toBe(2);
      expect(h[0]).toBe('H');
      expect(h[1]).toBe(20);
    });
  });

  describe('scales stroke-dasharray', () => {
    it('handles undefined stroke-dasharray', () => {
      let svg = createNodeSVG();
      let p = svg.path('M 1 2 L 3 4');
      expect(p.attr('stroke-dasharray')).toBe(undefined);
      expect(
        () => _scalePath(p, 5, 4, 3)
      ).not.toThrow();
      expect(p.attr('stroke-dasharray')).toBe(undefined);
    });

    it('scales values', () => {
      let svg = createNodeSVG();
      let p = svg.path('M 1 5 L 4 3');
      p.attr({ 'stroke-dasharray': '5 8 2' });
      _scalePath(p, 3, 7, 9);
      let s = p.attr('stroke-dasharray');
      let da = nonemptySplitByWhitespace(s);
      expect(da.length).toBe(3);
      expect(Number(da[0])).toBe(15);
      expect(Number(da[1])).toBe(24);
      expect(Number(da[2])).toBe(6);
    });
  });

  it('scales stroke-width', () => {
    let svg = createNodeSVG();
    let p = svg.path('M 1 2 L 3 4');
    p.attr({ 'stroke-width': 2.5 });
    _scalePath(p, 2, 3, 4);
    expect(p.attr('stroke-width')).toBeCloseTo(5, 3);
  });
});

it('_scaleCircle function', () => {
  let svg = createNodeSVG();
  let c = svg.circle(20);
  c.attr({
    'cx': 3,
    'cy': 50,
    'stroke-width': 1.5,
  });
  _scaleCircle(c, 3, 6, 5);
  expect(c.attr('cx')).toBe(-3);
  expect(c.attr('cy')).toBe(140);
  expect(c.attr('r')).toBe(30);
  expect(c.attr('stroke-width')).toBeCloseTo(4.5, 3);
});

it('_scaleRect function', () => {
  let svg = createNodeSVG();
  let r = svg.rect(20, 40);
  r.attr({
    'x': 4,
    'y': 18,
    'stroke-width': 2.5,
  });
  _scaleRect(r, 2, 9, 10);
  expect(r.attr('x')).toBe(-1);
  expect(r.attr('y')).toBe(26);
  expect(r.attr('width')).toBe(40);
  expect(r.attr('height')).toBe(80);
  expect(r.attr('stroke-width')).toBeCloseTo(5, 3);
});

describe('_scaleElements function', () => {
  it('uses correct origin (and scales multiple elements)', () => {
    let svg = createNodeSVG();
    let c = svg.circle(20);
    c.attr({ 'cx': 5, 'cy': 9 });
    let t1 = svg.text(add => add.tspan('a'));
    t1.attr({ 'x': 10, 'y': 12 });
    let t2 = svg.text(add => add.tspan('b'));
    t2.attr({ 'x': 4, 'y': 3 });
    _scaleElements(svg, 3);
    expect(c.attr('cx')).toBe(7);
    expect(c.attr('cy')).toBe(21);
    expect(t1.attr('x')).toBe(22);
    expect(t1.attr('y')).toBe(30);
    expect(t2.attr('x')).toBe(4);
    expect(t2.attr('y')).toBe(3);
  });

  it('scales text elements', () => {
    let svg = createNodeSVG();
    let t1 = svg.text(add => add.tspan('a'));
    t1.attr({ 'x': 50, 'y': 60 });
    let t2 = svg.text(add => add.tspan('b'));
    t2.attr({ 'x': 25, 'y': 30 });
    _scaleElements(svg, 2);
    expect(t1.attr('x')).toBe(75);
    expect(t1.attr('y')).toBe(90);
  });

  it('scales line elements', () => {
    let svg = createNodeSVG();
    let l = svg.line(5, 9, 3, 8);
    let t = svg.text(add => add.tspan('a'));
    t.attr({ 'x': 7, 'y': 6 });
    _scaleElements(svg, 3);
    expect(l.attr('x1')).toBe(1);
    expect(l.attr('y1')).toBe(15);
  });

  it('scales path elements', () => {
    let svg = createNodeSVG();
    let p = svg.path('M 3 5 L 2 9');
    let t = svg.text(add => add.tspan('a'));
    t.attr({ 'x': 19, 'y': 12 });
    _scaleElements(svg, 0.5);
    let pa = p.array();
    let m = pa[0];
    expect(m[1]).toBeCloseTo(11, 3);
    expect(m[2]).toBeCloseTo(8.5, 3);
  });

  it('scales circle elements', () => {
    let svg = createNodeSVG();
    let c = svg.circle(20);
    c.attr({ 'cx': 9, 'cy': 20 });
    let t = svg.text(add => add.tspan('g'));
    t.attr({ 'x': 7, 'y': 6 });
    _scaleElements(svg, 1.5);
    expect(c.attr('cx')).toBeCloseTo(10, 3);
    expect(c.attr('cy')).toBeCloseTo(27, 3);
  });

  it('scales rect elements', () => {
    let svg = createNodeSVG();
    let r = svg.rect(10, 15);
    r.attr({ 'x': 30, 'y': 40 });
    let t = svg.text(add => add.tspan('q'));
    t.attr({ 'x': 11, 'y': 14 });
    _scaleElements(svg, 0.5);
    expect(r.attr('x')).toBeCloseTo(20.5, 3);
    expect(r.attr('y')).toBeCloseTo(27, 3);
  });
});

describe('_resetTextDominantBaselines function', () => {
  it('ignores non-text elements', () => {
    let svg = createNodeSVG();
    let c = svg.circle(20);
    _resetTextDominantBaselines(svg);
    expect(c.attr('dominant-baseline')).toBe(undefined);
  });

  it('sets dominant-baseline to auto and updates x and y', () => {
    let svg = createNodeSVG();
    let t = svg.text(add => add.tspan('A'));
    t.attr({
      'y': 7.2,
      'font-size': 12,
      'dominant-baseline': 'middle',
    });
    let y = t.attr('y');
    let b = t.bbox();
    let cy = b.cy;
    _resetTextDominantBaselines(svg);
    expect(t.attr('dominant-baseline')).toBe('auto');
    expect(t.attr('y')).toBeGreaterThan(y);
    b = t.bbox();
    expect(b.cy).toBeCloseTo(cy, 3);
  });

  it('resets multiple text elements', () => {
    let svg = createNodeSVG();
    let t1 = svg.text(add => add.tspan('a'));
    t1.attr({
      'y': 5,
      'font-size': 20,
      'dominant-baseline': 'middle',
    });
    let t2 = svg.text(add => add.tspan('A'));
    t2.attr({
      'y': 20,
      'font-size': 8,
      'dominant-baseline': 'middle',
    });
    _resetTextDominantBaselines(svg);
    expect(t1.attr('dominant-baseline')).toBe('auto');
    expect(t2.attr('dominant-baseline')).toBe('auto');
  });
});

it('_trimNum function', () => {
  let n = 5.194712847124;
  let trimmed = trimNum(n, _NUMBER_TRIM);
  expect(trimmed).not.toEqual(n);
  expect(trimmed).toEqual(_trimNum(n));
});

describe('_trimTextNumbers function', () => {
  it('handles undefined and string font-size', () => {
    let svg = createNodeSVG();
    let t = svg.text(add => add.tspan('a'));
    expect(t.attr('font-size')).toBe(undefined);
    expect(
      () => _trimTextNumbers(t)
    ).not.toThrow();
    expect(t.attr('font-size')).toBe(undefined);
    t.attr({ 'font-size': 'medium' });
    expect(
      () => _trimTextNumbers(t)
    ).not.toThrow();
    expect(t.attr('font-size')).toBe('medium');
  });

  it('trims the numbers', () => {
    let svg = createNodeSVG();
    let x = 1.3857191924124;
    let y = 6.18719285719;
    let fs = 12.223985719114;
    expect(_trimNum(x)).not.toEqual(x);
    expect(_trimNum(y)).not.toEqual(y);
    expect(_trimNum(fs)).not.toEqual(fs);
    let t = svg.text(add => add.tspan('a'));
    t.attr({ 'x': x, 'y': y, 'font-size': fs });
    _trimTextNumbers(t);
    expect(t.attr('x')).toEqual(_trimNum(x));
    expect(t.attr('y')).toEqual(_trimNum(y));
    expect(t.attr('font-size')).toEqual(_trimNum(fs));
  });
});

it('_trimLineNumbers function', () => {
  let svg = createNodeSVG();
  let x1 = 23.1192847192591;
  let y1 = 1.2395817941124;
  let x2 = -2198.1358179119149;
  let y2 = 6.1985712948179284;
  let sw = 5.129481729182471;
  expect(_trimNum(x1)).not.toEqual(x1);
  expect(_trimNum(y1)).not.toEqual(y1);
  expect(_trimNum(x2)).not.toEqual(x2);
  expect(_trimNum(y2)).not.toEqual(y2);
  expect(_trimNum(sw)).not.toEqual(sw);
  let l = svg.line(x1, y1, x2, y2);
  l.attr({ 'stroke-width': sw });
  _trimLineNumbers(l);
  expect(l.attr('x1')).toEqual(_trimNum(x1));
  expect(l.attr('y1')).toEqual(_trimNum(y1));
  expect(l.attr('x2')).toEqual(_trimNum(x2));
  expect(l.attr('y2')).toEqual(_trimNum(y2));
  expect(l.attr('stroke-width')).toEqual(_trimNum(sw));
});

describe('_trimPathNumbers function', () => {
  describe('trims segment numbers', () => {
    it('handles undefined segments', () => {
      let svg = createNodeSVG();
      let p = svg.path();
      expect(
        () => _trimPathNumbers(p)
      ).not.toThrow();
    });

    it('trims the numbers', () => {
      let svg = createNodeSVG();
      let mx = 5.1248172984712341;
      let my = 424.12395873985174;
      let lx = -2.4837859817249;
      let ly = 0.13581798791244;
      expect(_trimNum(mx)).not.toEqual(mx);
      expect(_trimNum(my)).not.toEqual(my);
      expect(_trimNum(lx)).not.toEqual(lx);
      expect(_trimNum(ly)).not.toEqual(ly);
      let d = ['M', mx, my, 'L', lx, ly].join(' ');
      let p = svg.path(d);
      _trimPathNumbers(p);
      let pa = p.array();
      expect(pa.length).toBe(2);
      let m = pa[0];
      expect(m.length).toBe(3);
      expect(m[0]).toBe('M');
      expect(m[1]).toEqual(_trimNum(mx));
      expect(m[2]).toEqual(_trimNum(my));
      let l = pa[1];
      expect(l.length).toBe(3);
      expect(l[0]).toBe('L');
      expect(l[1]).toEqual(_trimNum(lx));
      expect(l[2]).toEqual(_trimNum(ly));
    });
  });
  
  describe('trims stroke-dasharray', () => {
    it('handles undefined stroke-dasharray', () => {
      let svg = createNodeSVG();
      let p = svg.path('M 1 2 L 3 4');
      expect(p.attr('stroke-dasharray')).toBe(undefined);
      expect(
        () => _trimPathNumbers(p)
      ).not.toThrow();
    });

    it('trims the numbers', () => {
      let svg = createNodeSVG();
      let p = svg.path('M 5 6 L 3 4');
      let da = [5.198471284, 7.129847192];
      da.forEach(n => {
        expect(_trimNum(n)).not.toEqual(n);
      });
      p.attr({ 'stroke-dasharray': da.join(' ') });
      _trimPathNumbers(p);
      let s = p.attr('stroke-dasharray');
      let vs = nonemptySplitByWhitespace(s);
      let ns = [];
      vs.forEach(v => {
        ns.push(Number(v));
      });
      expect(ns.length).toBe(2);
      expect(ns[0]).toEqual(_trimNum(da[0]));
      expect(ns[1]).toEqual(_trimNum(da[1]));
    });
  });
  
  it('trims stroke-width', () => {
    let svg = createNodeSVG();
    let sw = 6.19847192847192;
    expect(_trimNum(sw)).not.toEqual(sw);
    let p = svg.path('M 1 2 L 3 4');
    p.attr({ 'stroke-width': sw });
    _trimPathNumbers(p);
    expect(p.attr('stroke-width')).toEqual(_trimNum(sw));
  });
});

it('_trimCircleNumbers function', () => {
  let svg = createNodeSVG();
  let cx = 6.158712985715;
  let cy = 15.19481729481724;
  let r = 10.22985719851751;
  let sw = 5.12129812749;
  expect(_trimNum(cx)).not.toEqual(cx);
  expect(_trimNum(cy)).not.toEqual(cy);
  expect(_trimNum(r)).not.toEqual(r);
  expect(_trimNum(sw)).not.toEqual(sw);
  let c = svg.circle(2 * r);
  c.attr({ 'cx': cx, 'cy': cy, 'stroke-width': sw });
  _trimCircleNumbers(c);
  expect(c.attr('cx')).toEqual(_trimNum(cx));
  expect(c.attr('cy')).toEqual(_trimNum(cy));
  expect(c.attr('r')).toEqual(_trimNum(r));
  expect(c.attr('stroke-width')).toEqual(_trimNum(sw));
});

it('_trimRectNumbers function', () => {
  let svg = createNodeSVG();
  let x = 23.93857913817;
  let y = 12.2938571398517;
  let w = 48.13958719857;
  let h = 18.1985719825791;
  let sw = 2.238571389517;
  expect(_trimNum(x)).not.toEqual(x);
  expect(_trimNum(y)).not.toEqual(y);
  expect(_trimNum(w)).not.toEqual(w);
  expect(_trimNum(h)).not.toEqual(h);
  expect(_trimNum(sw)).not.toEqual(sw);
  let r = svg.rect(w, h);
  r.attr({ 'x': x, 'y': y, 'stroke-width': sw });
  _trimRectNumbers(r);
  expect(r.attr('x')).toEqual(_trimNum(x));
  expect(r.attr('y')).toEqual(_trimNum(y));
  expect(r.attr('width')).toEqual(_trimNum(w));
  expect(r.attr('height')).toEqual(_trimNum(h));
  expect(r.attr('stroke-width')).toEqual(_trimNum(sw));
});

describe('_trimNumbers function', () => {
  it('trims text element numbers', () => {
    let svg = createNodeSVG();
    let x = 1.38937591871;
    expect(_trimNum(x)).not.toEqual(x);
    let t = svg.text(add => add.tspan('t'));
    t.attr({ 'x': x });
    _trimNumbers(svg);
    expect(t.attr('x')).toEqual(_trimNum(x));
  });

  it('trims line element numbers', () => {
    let svg = createNodeSVG();
    let x1 = 5.12841294811;
    expect(_trimNum(x1)).not.toEqual(x1);
    let l = svg.line(x1, 5, 7, 8);
    _trimNumbers(svg);
    expect(l.attr('x1')).toEqual(_trimNum(x1));
  });

  it('trims path element numbers', () => {
    let svg = createNodeSVG();
    let mx = 5.129481724827;
    expect(_trimNum(mx)).not.toEqual(mx);
    let d = ['M', mx, 5, 'L', 6, 2].join(' ');
    let p = svg.path(d);
    _trimNumbers(svg);
    let pa = p.array();
    let m = pa[0];
    expect(m[1]).toEqual(_trimNum(mx));
  });

  it('trims circle element numbers', () => {
    let svg = createNodeSVG();
    let cx = 5.1948712984719;
    expect(_trimNum(cx)).not.toEqual(cx);
    let c = svg.circle(34);
    c.attr({ 'cx': cx });
    _trimNumbers(svg);
    expect(c.attr('cx')).toEqual(_trimNum(cx));
  });

  it('trims rect element numbers', () => {
    let svg = createNodeSVG();
    let x = 6.1298417298471;
    expect(_trimNum(x)).not.toEqual(x);
    let r = svg.rect(3, 9);
    r.attr({ 'x': x });
    _trimNumbers(svg);
    expect(r.attr('x')).toEqual(_trimNum(x));
  });

  it('trims numbers for multiple elements', () => {
    let svg = createNodeSVG();
    let x = 6.12948172944;
    let cx = 0.397162947182;
    expect(_trimNum(x)).not.toEqual(x);
    expect(_trimNum(cx)).not.toEqual(cx);
    let t = svg.text(add => add.tspan('t'));
    t.attr({ 'x': x });
    let c = svg.circle(20);
    c.attr({ 'cx': cx });
    _trimNumbers(svg);
    expect(t.attr('x')).toEqual(_trimNum(x));
    expect(c.attr('cx')).toEqual(_trimNum(cx));
  });
});

it('_setDimensions function', () => {
  let svg = createNodeSVG();
  let t1 = svg.text(add => add.tspan('a'));
  t1.attr({ 'x': 5, 'y': 7 });
  let t2 = svg.text(add => add.tspan('b'));
  t2.attr({ 'x': 50, 'y': 100 });
  let t3 = svg.text(add => add.tspan('c'));
  t3.attr({ 'x': 30, 'y': 78 });
  _setDimensions(svg);
  expect(svg.viewbox().x).toBe(0);
  expect(svg.viewbox().y).toBe(0);
  expect(svg.viewbox().width).toBe(50 + _X_PADDING);
  expect(svg.viewbox().height).toBe(100 + _Y_PADDING);
  expect(svg.attr('width')).toBe(50 + _X_PADDING);
  expect(svg.attr('height')).toBe(100 + _Y_PADDING);
});

describe('formatSvgForExport function', () => {
  it('removes invisible lines', () => {
    let svg = createNodeSVG();
    let l1 = svg.line(2, 4, 6, 8);
    let l2 = svg.line(5, 5, 9, 8);
    let l3 = svg.line(1, 3, 5, 7);
    let id1 = l1.id();
    let id2 = l2.id();
    let id3 = l3.id();
    l1.attr({ 'stroke-opacity': 0 });
    l2.attr({ 'stroke-opacity': 0.5 });
    l3.attr({ 'opacity': 0 });
    expect(svg.findOne('#' + id1)).not.toBe(null);
    expect(svg.findOne('#' + id2)).not.toBe(null);
    expect(svg.findOne('#' + id3)).not.toBe(null);
    formatSvgForExport(svg);
    expect(svg.findOne('#' + id1)).toBe(null);
    expect(svg.findOne('#' + id2)).not.toBe(null);
    expect(svg.findOne('#' + id3)).toBe(null);
  });

  it('shifts elements', () => {
    let svg = createNodeSVG();
    let x = 9142;
    let y = 1245;
    expect(x).not.toEqual(_X_PADDING);
    expect(y).not.toEqual(_Y_PADDING);
    let t = svg.text(add => add.tspan('a'));
    t.attr({ 'x': x, 'y': y });
    formatSvgForExport(svg);
    expect(t.attr('x')).toBeCloseTo(_X_PADDING, 3);
    expect(t.attr('y')).toBeCloseTo(_Y_PADDING, 3);
  });

  it('scales elements', () => {
    let svg = createNodeSVG();
    let t = svg.text(add => add.tspan('t'));
    t.attr({ 'font-size': 9 });
    formatSvgForExport(svg, 2);
    expect(t.attr('font-size')).toBe(18);
  });

  it('trims numbers', () => {
    let svg = createNodeSVG();
    let fs = 10.235273798172;
    expect(_trimNum(fs)).not.toEqual(fs);
    let t = svg.text(add => add.tspan('b'));
    t.attr({ 'font-size': fs });
    formatSvgForExport(svg, 1);
    expect(t.attr('font-size')).toEqual(_trimNum(fs));
  });

  it('resets text dominant-baseline attributes', () => {
    let svg = createNodeSVG();
    let t = svg.text(add => add.tspan('a'));
    t.attr({
      'y': 8,
      'font-size': 20,
      'dominant-baseline': 'hanging',
    });
    formatSvgForExport(svg);
    expect(t.attr('dominant-baseline')).toBe('auto');
  });

  it('sets SVG dimensions', () => {
    let svg = createNodeSVG();
    let t1 = svg.text(add => add.tspan('a'));
    t1.attr({ 'x': 50, 'y': 25 });
    let t2 = svg.text(add => add.tspan('b'));
    t2.attr({ 'x': 100, 'y': 150 });
    formatSvgForExport(svg, 1);
    expect(svg.viewbox().x).toBe(0);
    expect(svg.viewbox().y).toBe(0);
    expect(svg.viewbox().width).toBeCloseTo((2 * _X_PADDING) + 50, 3);
    expect(svg.viewbox().height).toBeCloseTo((2 * _Y_PADDING) + 125, 3);
    expect(svg.attr('width')).toBeCloseTo((2 * _X_PADDING) + 50, 3);
    expect(svg.attr('height')).toBeCloseTo((2 * _Y_PADDING) + 125, 3);
  });
});
