import {
  formatSVGforExport,
  _X_PADDING,
  _Y_PADDING,
  _xTextMin,
  _yTextMin,
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
  _NUMBER_TRIM,
  _trimTextNumbers,
  _trimLineNumbers,
  _trimPathNumbers,
  _trimCircleNumbers,
  _trimRectNumbers,
  _trimNumbers,
} from './formatSVGforExport';
import createNodeSVG from '../draw/createNodeSVG';
import { nonemptySplitByWhitespace } from '../parse/nonemptySplitByWhitespace';

describe('_xTextMin and _yTextMin functions', () => {
  it('no text elements', () => {
    let svg = createNodeSVG();
    svg.circle(100);
    expect(_xTextMin(svg)).toBe(0);
    expect(_yTextMin(svg)).toBe(0);
  });

  it('ignore non-text elements', () => {
    let svg = createNodeSVG();
    let c = svg.circle(50);
    c.attr({ 'cx': 25, 'cy': 25 });
    let t = svg.text(add => add.tspan('a'));
    t.attr({ 'x': 50, 'y': 75 });
    expect(_xTextMin(svg)).toBe(50);
    expect(_yTextMin(svg)).toBe(75);
  });

  it('multiple text elements', () => {
    let svg = createNodeSVG();
    let t1 = svg.text(add => add.tspan('a'));
    t1.attr({ 'x': 50, 'y': 66 });
    let t2 = svg.text(add => add.tspan('b'));
    t2.attr({ 'x': 25, 'y': 78 });
    let t3 = svg.text(add => add.tspan('c'));
    t3.attr({ 'x': 45, 'y': 35 });
    expect(_xTextMin(svg)).toBe(25);
    expect(_yTextMin(svg)).toBe(35);
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

it('_trimTextNumbers function', () => {
  let svg = createNodeSVG();
  let t = svg.text(add => add.tspan('a'));
  let x = 1.3857191924124;
  let y = 6.18719285719;
  let fs = 12.223985719114;
  expect(x.toFixed(_NUMBER_TRIM) == x).toBeFalsy();
  expect(y.toFixed(_NUMBER_TRIM) == y).toBeFalsy();
  expect(fs.toFixed(_NUMBER_TRIM) == fs).toBeFalsy();
  t.attr({ 'x': x, 'y': y, 'font-size': fs });
  _trimTextNumbers(t);
  expect(t.attr('x') == x.toFixed(_NUMBER_TRIM)).toBeTruthy();
  expect(t.attr('y') == y.toFixed(_NUMBER_TRIM)).toBeTruthy();
  expect(t.attr('font-size') == fs.toFixed(_NUMBER_TRIM)).toBeTruthy();
});

it('_trimLineNumbers function', () => {
  let svg = createNodeSVG();
  let x1 = 23.1192847192591;
  let y1 = 1.2395817941124;
  let x2 = -2198.1358179119149;
  let y2 = 6.1985712948179284;
  let sw = 5.129481729182471;
  expect(x1.toFixed(_NUMBER_TRIM) == x1).toBeFalsy();
  expect(y1.toFixed(_NUMBER_TRIM) == y1).toBeFalsy();
  expect(x2.toFixed(_NUMBER_TRIM) == x2).toBeFalsy();
  expect(y2.toFixed(_NUMBER_TRIM) == y2).toBeFalsy();
  expect(sw.toFixed(_NUMBER_TRIM) == sw).toBeFalsy();
  let l = svg.line(x1, y1, x2, y2);
  l.attr({ 'stroke-width': sw });
  _trimLineNumbers(l);
  expect(l.attr('x1') == x1.toFixed(_NUMBER_TRIM)).toBeTruthy();
  expect(l.attr('y1') == y1.toFixed(_NUMBER_TRIM)).toBeTruthy();
  expect(l.attr('x2') == x2.toFixed(_NUMBER_TRIM)).toBeTruthy();
  expect(l.attr('y2') == y2.toFixed(_NUMBER_TRIM)).toBeTruthy();
  expect(l.attr('stroke-width') == sw.toFixed(_NUMBER_TRIM)).toBeTruthy();
});

describe('_trimPathNumbers function', () => {
  it('trims stroke-width', () => {
    let svg = createNodeSVG();
    let p = svg.path('M 1 2 Q 5 8 2 5');
    let sw = 5.13859712948;
    expect(sw.toFixed(_NUMBER_TRIM) == sw).toBeFalsy();
    p.attr({ 'stroke-width': sw });
    _trimPathNumbers(p);
    expect(p.attr('stroke-width') == sw.toFixed(_NUMBER_TRIM)).toBeTruthy();
  });

  it('trims stroke-dasharray', () => {
    let svg = createNodeSVG();
    let p = svg.path('M 4 5 L 100 4000');
    let da = [5.1298471284781, 6.192847128472];
    da.forEach(n => {
      expect(n.toFixed(_NUMBER_TRIM) == n).toBeFalsy();
    });
    p.attr({
      'stroke-dasharray': da.join(' '),
      'stroke-width': 1.5,
    });
    _trimPathNumbers(p);
    let s = p.attr('stroke-dasharray');
    let vs = nonemptySplitByWhitespace(s);
    let ns = [];
    vs.forEach(v => {
      ns.push(Number.parseFloat(v));
    });
    expect(ns.length).toBe(2);
    expect(ns[0] == da[0].toFixed(_NUMBER_TRIM)).toBeTruthy();
    expect(ns[1] == da[1].toFixed(_NUMBER_TRIM)).toBeTruthy();
  });

  it('trims d', () => {
    let svg = createNodeSVG();
    let mx = 5.1248172984712341;
    let my = 424.12395873985174;
    let lx = -2.4837859817249;
    let ly = 0.13581798791244;
    expect(mx.toFixed(_NUMBER_TRIM) == mx).toBeFalsy();
    expect(my.toFixed(_NUMBER_TRIM) == my).toBeFalsy();
    expect(lx.toFixed(_NUMBER_TRIM) == lx).toBeFalsy();
    expect(ly.toFixed(_NUMBER_TRIM) == ly).toBeFalsy();
    let d = ['M', mx, my, 'L', lx, ly].join(' ');
    let p = svg.path(d);
    _trimPathNumbers(p);
    let segments = p.array();
    let m = segments[0];
    expect(m[1] == mx.toFixed(_NUMBER_TRIM)).toBeTruthy();
    expect(m[2] == my.toFixed(_NUMBER_TRIM)).toBeTruthy();
    let l = segments[1];
    expect(l[1] == lx.toFixed(_NUMBER_TRIM)).toBeTruthy();
    expect(l[2] == ly.toFixed(_NUMBER_TRIM)).toBeTruthy();
  });
});

it('_trimCircleNumbers function', () => {
  let svg = createNodeSVG();
  let cx = 6.158712985715;
  let cy = 15.19481729481724;
  let r = 10.22985719851751;
  let sw = 5.12129812749;
  expect(cx.toFixed(_NUMBER_TRIM) == cx).toBeFalsy();
  expect(cy.toFixed(_NUMBER_TRIM) == cy).toBeFalsy();
  expect(r.toFixed(_NUMBER_TRIM) == r).toBeFalsy();
  expect(sw.toFixed(_NUMBER_TRIM) == sw).toBeFalsy();
  let c = svg.circle(2 * r);
  c.attr({ 'cx': cx, 'cy': cy, 'stroke-width': sw });
  _trimCircleNumbers(c);
  expect(c.attr('cx') == cx.toFixed(_NUMBER_TRIM)).toBeTruthy();
  expect(c.attr('cy') == cy.toFixed(_NUMBER_TRIM)).toBeTruthy();
  expect(c.attr('r') == r.toFixed(_NUMBER_TRIM)).toBeTruthy();
  expect(c.attr('stroke-width') == sw.toFixed(_NUMBER_TRIM)).toBeTruthy();
});

it('_trimRectNumbers function', () => {
  let svg = createNodeSVG();
  let x = 23.93857913817;
  let y = 12.2938571398517;
  let w = 48.13958719857;
  let h = 18.1985719825791;
  let sw = 2.238571389517;
  expect(x.toFixed(_NUMBER_TRIM) == x).toBeFalsy();
  expect(y.toFixed(_NUMBER_TRIM) == y).toBeFalsy();
  expect(w.toFixed(_NUMBER_TRIM) == w).toBeFalsy();
  expect(h.toFixed(_NUMBER_TRIM) == h).toBeFalsy();
  expect(sw.toFixed(_NUMBER_TRIM) == sw).toBeFalsy();
  let r = svg.rect(w, h);
  r.attr({ 'x': x, 'y': y, 'stroke-width': sw });
  _trimRectNumbers(r);
  expect(r.attr('x') == x.toFixed(_NUMBER_TRIM)).toBeTruthy();
  expect(r.attr('y') == y.toFixed(_NUMBER_TRIM)).toBeTruthy();
  expect(r.attr('width') == w.toFixed(_NUMBER_TRIM)).toBeTruthy();
  expect(r.attr('height') == h.toFixed(_NUMBER_TRIM)).toBeTruthy();
  expect(r.attr('stroke-width') == sw.toFixed(_NUMBER_TRIM)).toBeTruthy();
});

describe('_trimNumbers function', () => {
  it('trims text element numbers', () => {
    let svg = createNodeSVG();
    let x = 1.38937591871;
    expect(x.toFixed(_NUMBER_TRIM) == x).toBeFalsy();
    let t = svg.text(add => add.tspan('t'));
    t.attr({ 'x': x, 'y': 3.12, 'font-size': 12 });
    _trimNumbers(svg);
    expect(t.attr('x') == x.toFixed(_NUMBER_TRIM)).toBeTruthy();
  });

  it('trims line element numbers', () => {
    let svg = createNodeSVG();
    let x1 = 5.12841294811;
    expect(x1.toFixed(_NUMBER_TRIM) == x1).toBeFalsy();
    let l = svg.line(x1, 5, 7, 8);
    l.attr({ 'stroke-width': 2 });
    _trimNumbers(svg);
    expect(l.attr('x1') == x1.toFixed(_NUMBER_TRIM)).toBeTruthy();
  });

  it('trims path element numbers', () => {
    let svg = createNodeSVG();
    let mx = 5.129481724827;
    expect(mx.toFixed(_NUMBER_TRIM) == mx).toBeFalsy();
    let d = ['M', mx, 5, 'L', 6, 2].join(' ');
    let p = svg.path(d);
    p.attr({ 'stroke-width': 1 });
    _trimNumbers(svg);
    let segments = p.array();
    let m = segments[0];
    expect(m[1] == mx.toFixed(_NUMBER_TRIM)).toBeTruthy();
  });

  it('trims circle element numbers', () => {
    let svg = createNodeSVG();
    let cx = 5.1948712984719;
    expect(cx.toFixed(_NUMBER_TRIM) == cx).toBeFalsy();
    let c = svg.circle(34);
    c.attr({ 'cx': cx, 'cy': 5, 'stroke-width': 1 });
    _trimNumbers(svg);
    expect(c.attr('cx') == cx.toFixed(_NUMBER_TRIM)).toBeTruthy();
  });

  it('trims rect element numbers', () => {
    let svg = createNodeSVG();
    let x = 6.1298417298471;
    expect(x.toFixed(_NUMBER_TRIM) == x).toBeFalsy();
    let r = svg.rect(3, 9);
    r.attr({ 'x': x, 'y': 3, 'stroke-width': 1.5 });
    _trimNumbers(svg);
    expect(r.attr('x') == x.toFixed(_NUMBER_TRIM)).toBeTruthy();
  });

  it('trims numbers for multiple elements', () => {
    let svg = createNodeSVG();
    let x = 6.12948172944;
    let cx = 0.397162947182;
    expect(x.toFixed(_NUMBER_TRIM) == x).toBeFalsy();
    expect(cx.toFixed(_NUMBER_TRIM) == cx).toBeFalsy();
    let t = svg.text(add => add.tspan('t'));
    t.attr({ 'x': x, 'y': 5, 'font-size': 15 });
    let c = svg.circle(20);
    c.attr({ 'cx': cx, 'cy': 6, 'stroke-width': 2 });
    _trimNumbers(svg);
    expect(t.attr('x') == x.toFixed(_NUMBER_TRIM)).toBeTruthy();
    expect(c.attr('cx') == cx.toFixed(_NUMBER_TRIM)).toBeTruthy();
  });
});
