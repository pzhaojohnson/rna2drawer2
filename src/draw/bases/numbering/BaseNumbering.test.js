import { BaseNumbering } from './BaseNumbering';
import { NodeSVG } from 'Draw/NodeSVG';
import { SVGTextWrapper as TextWrapper } from 'Draw/svg/text';
import { SVGLineWrapper as LineWrapper } from 'Draw/svg/line';
import Base from 'Draw/Base';
import { addNumbering } from './add';
import normalizeAngle from 'Draw/normalizeAngle';
import { round } from 'Math/round';
import { position } from './position';

let container = null;
let svg = null;
let base = null;
let numbering = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  base = Base.create(svg, 'G', 12, 15);
  addNumbering(base, 50);
  numbering = base.numbering;
});

afterEach(() => {
  numbering = null;
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
      let t = new TextWrapper(svg.text('a'));
      let l = new LineWrapper(svg.line(1, 5, 8, 12));
      let c = svg.circle(20);
      let bc = { x: 3, y: 8 };
      expect(
        () => new BaseNumbering(new TextWrapper(c), l, bc)
      ).toThrow();
      expect(
        () => new BaseNumbering(t, new LineWrapper(c), bc)
      ).toThrow();
    });

    it('initializes element IDs', () => {
      let t = new TextWrapper(svg.text('1'));
      let l = new LineWrapper(svg.line(1, 5, 8, 12));
      expect(t.attr('id')).toBe(undefined);
      expect(l.attr('id')).toBe(undefined);
      let n = new BaseNumbering(t, l, { x: 1, y: 2 });
      expect(t.attr('id')).toBeTruthy();
      expect(l.attr('id')).toBeTruthy();
    });
  });

  it('id getter', () => {
    let t = new TextWrapper(svg.text('6'));
    let l = new LineWrapper(svg.line(10, 20, 30, 40));
    let n = new BaseNumbering(t, l, { x: 10, y: 20 });
    expect(n.id).toBe(t.id());
  });

  it('basePadding, lineAngle and lineLength properties', () => {
    numbering.reposition({ baseCenter: { x: 25.5, y: 256 } })
    // use setters
    numbering.basePadding = 18.07;
    numbering.lineAngle = 4.2;
    numbering.lineLength = 26.6;
    // check getters
    expect(numbering.basePadding).toBeCloseTo(18.07);
    expect(normalizeAngle(numbering.lineAngle, 0)).toBeCloseTo(4.2);
    expect(numbering.lineLength).toBeCloseTo(26.6);
    // check actual positioning
    let rp1 = getRoundedPositioning(numbering);
    position(numbering, {
      baseCenter: { x: 25.5, y: 256 },
      basePadding: 18.07,
      lineAngle: 4.2,
      lineLength: 26.6,
      textPadding: numbering.textPadding,
    });
    let rp2 = getRoundedPositioning(numbering);
    expect(rp1).toEqual(rp2);
  });

  describe('reposition method', () => {
    it('can be called with no arguments', () => {
      numbering.reposition({ baseCenter: { x: 520, y: 465 } });
      numbering.basePadding = 16.6;
      numbering.lineAngle = 2.8;
      numbering.lineLength = 18.25;
      numbering.reposition();
      let rp1 = getRoundedPositioning(numbering);
      position(numbering, {
        baseCenter: { x: 520, y: 465 },
        basePadding: 16.6,
        lineAngle: 2.8,
        lineLength: 18.25,
        textPadding: numbering.textPadding,
      });
      let rp2 = getRoundedPositioning(numbering);
      expect(rp1).toEqual(rp2);
    });

    it('can be called with arguments', () => {
      numbering.reposition({ baseCenter: { x: 12, y: 300 } });
      numbering.reposition({
        baseCenter: { x: 15, y: 1012 },
        basePadding: 25.2,
        lineAngle: 15.5,
        lineLength: 8.22,
      });
      let rp1 = getRoundedPositioning(numbering);
      position(numbering, {
        baseCenter: { x: 15, y: 1012 },
        basePadding: 25.2,
        lineAngle: 15.5,
        lineLength: 8.22,
        textPadding: numbering.textPadding,
      });
      let rp2 = getRoundedPositioning(numbering);
      expect(rp1).toEqual(rp2);
    });

    it('stores base center when provided', () => {
      numbering.reposition({ baseCenter: { x: 65, y: 19 } });
      numbering.reposition({ baseCenter: { x: 421, y: 328 } });
      numbering.reposition({ basePadding: 82 });
      let rp1 = getRoundedPositioning(numbering);
      position(numbering, {
        baseCenter: { x: 421, y: 328 },
        basePadding: 82,
        lineAngle: numbering.lineAngle,
        lineLength: numbering.lineLength,
        textPadding: numbering.textPadding,
      });
      let rp2 = getRoundedPositioning(numbering);
      expect(rp1).toEqual(rp2);
    });
  });

  it('bringToFront and sendToBack methods', () => {
    let r1 = svg.rect(5, 6);
    let r2 = svg.rect(20, 20);
    let c = svg.circle(20);
    // create above multiple elements
    numbering.bringToFront();
    expect(numbering.text.position()).toBeGreaterThan(3);
    expect(numbering.line.position()).toBeGreaterThan(3);
    numbering.sendToBack();
    expect(numbering.text.position()).toBeLessThanOrEqual(1);
    expect(numbering.line.position()).toBeLessThanOrEqual(1);
    numbering.bringToFront();
    expect(numbering.line.position()).toBeGreaterThan(3);
    expect(numbering.text.position()).toBeGreaterThan(3);
  });

  it('regenerateIds method', () => {
    let oldTextId = numbering.text.id();
    let oldLineId = numbering.line.id();
    numbering.regenerateIds();
    expect(numbering.text.id()).not.toBe(oldTextId);
    expect(numbering.line.id()).not.toBe(oldLineId);
  });
});
