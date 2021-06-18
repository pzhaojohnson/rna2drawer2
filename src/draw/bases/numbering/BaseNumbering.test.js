import { BaseNumbering } from './BaseNumbering';
import NodeSVG from 'Draw/NodeSVG';
import Base from 'Draw/Base';
import { addNumbering } from './add';
import normalizeAngle from 'Draw/normalizeAngle';
import { round } from 'Math/round';
import { position } from './position';

let container = null;
let svg = null;
let base = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  base = Base.create(svg, 'G', 12, 15);
  addNumbering(base, 50);
});

afterEach(() => {
  base = null;

  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

function getRoundedPositioning(n) {
  return {
    line: {
      'x1': round(n.line.attr('x1'), 3),
      'y1': round(n.line.attr('y1'), 3),
      'x2': round(n.line.attr('x2'), 3),
      'y2': round(n.line.attr('y2'), 3),
    },
    text: {
      'x': round(n.text.attr('x'), 3),
      'y': round(n.text.attr('y'), 3),
      'text-anchor': n.text.attr('text-anchor'),
    }
  };
}

describe('BaseNumbering class', () => {
  describe('constructor', () => {
    it('checks passed element types', () => {
      let t = svg.text('a');
      let l = svg.line(1, 5, 8, 12);
      let c = svg.circle(20);
      expect(
        () => new BaseNumbering(c, l, { x: 1, y: 2 })
      ).toThrow();
      expect(
        () => new BaseNumbering(t, c, { x: 10, y: 20 })
      ).toThrow();
    });

    it('initializes element IDs', () => {
      let t = svg.text('1');
      let l = svg.line(1, 5, 8, 12);
      expect(t.attr('id')).toBe(undefined);
      expect(l.attr('id')).toBe(undefined);
      let n = new BaseNumbering(t, l, { x: 1, y: 2 });
      expect(t.attr('id')).toBeTruthy();
      expect(l.attr('id')).toBeTruthy();
    });
  });

  it('id getter', () => {
    let t = svg.text(add => add.tspan('6'));
    t.id('asdfzxcv');
    let l = svg.line(10, 20, 30, 40);
    let n = new BaseNumbering(t, l, { x: 10, y: 20 });
    expect(n.id).toBe('asdfzxcv');
  });

  it('basePadding, lineAngle and lineLength properties', () => {
    let n = base.numbering;
    n.reposition({ baseCenter: { x: 25.5, y: 256 } })
    // use setters
    n.basePadding = 18.07;
    n.lineAngle = 4.2;
    n.lineLength = 26.6;
    // check getters
    expect(n.basePadding).toBeCloseTo(18.07);
    expect(normalizeAngle(n.lineAngle, 0)).toBeCloseTo(4.2);
    expect(n.lineLength).toBeCloseTo(26.6);
    // check actual positioning
    let rp1 = getRoundedPositioning(n);
    position(n, {
      baseCenter: { x: 25.5, y: 256 },
      basePadding: 18.07,
      lineAngle: 4.2,
      lineLength: 26.6,
      textPadding: n.textPadding,
    });
    let rp2 = getRoundedPositioning(n);
    expect(rp1).toEqual(rp2);
  });

  describe('reposition method', () => {
    it('can be called with no arguments', () => {
      let n = base.numbering;
      n.reposition({ baseCenter: { x: 520, y: 465 } });
      n.basePadding = 16.6;
      n.lineAngle = 2.8;
      n.lineLength = 18.25;
      n.reposition();
      let rp1 = getRoundedPositioning(n);
      position(n, {
        baseCenter: { x: 520, y: 465 },
        basePadding: 16.6,
        lineAngle: 2.8,
        lineLength: 18.25,
        textPadding: n.textPadding,
      });
      let rp2 = getRoundedPositioning(n);
      expect(rp1).toEqual(rp2);
    });

    it('can be called with arguments', () => {
      let n = base.numbering;
      n.reposition({ baseCenter: { x: 12, y: 300 } });
      n.reposition({
        baseCenter: { x: 15, y: 1012 },
        basePadding: 25.2,
        lineAngle: 15.5,
        lineLength: 8.22,
      });
      let rp1 = getRoundedPositioning(n);
      position(n, {
        baseCenter: { x: 15, y: 1012 },
        basePadding: 25.2,
        lineAngle: 15.5,
        lineLength: 8.22,
        textPadding: n.textPadding,
      });
      let rp2 = getRoundedPositioning(n);
      expect(rp1).toEqual(rp2);
    });

    it('stores base center when provided', () => {
      let n = base.numbering;
      n.reposition({ baseCenter: { x: 65, y: 19 } });
      n.reposition({ baseCenter: { x: 421, y: 328 } });
      n.reposition({ basePadding: 82 });
      let rp1 = getRoundedPositioning(n);
      position(n, {
        baseCenter: { x: 421, y: 328 },
        basePadding: 82,
        lineAngle: n.lineAngle,
        lineLength: n.lineLength,
        textPadding: n.textPadding,
      });
      let rp2 = getRoundedPositioning(n);
      expect(rp1).toEqual(rp2);
    });
  });

  it('bringToFront and sendToBack methods', () => {
    let r1 = svg.rect(5, 6);
    let r2 = svg.rect(20, 20);
    let c = svg.circle(20);
    // create above multiple elements
    let n = base.numbering;
    n.bringToFront();
    expect(n.text.position()).toBeGreaterThan(3);
    expect(n.line.position()).toBeGreaterThan(3);
    n.sendToBack();
    expect(n.text.position()).toBeLessThanOrEqual(1);
    expect(n.line.position()).toBeLessThanOrEqual(1);
    n.bringToFront();
    expect(n.line.position()).toBeGreaterThan(3);
    expect(n.text.position()).toBeGreaterThan(3);
  });

  it('refreshIds method', () => {
    let n = base.numbering;
    let oldTextId = n.text.id();
    let oldLineId = n.line.id();
    n.refreshIds();
    expect(n.text.id()).not.toBe(oldTextId);
    expect(n.line.id()).not.toBe(oldLineId);
  });
});
