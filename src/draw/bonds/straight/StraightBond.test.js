import { StraightBond } from './StraightBond';
import NodeSVG from 'Draw/NodeSVG';
import Base from 'Draw/Base';
import { distance2D as distance } from 'Math/distance';
import angleBetween from 'Draw/angleBetween';
import normalizeAngle from 'Draw/normalizeAngle';
import pair from 'Draw/interact/fold/pair';

let svg = NodeSVG();

describe('StraightBond class', () => {
  it('_lineCoordinates static method', () => {
    let b1 = Base.create(svg, 'A', 5, 8);
    let b2 = Base.create(svg, 'r', 77, 980);
    let lcs = StraightBond._lineCoordinates(b1, b2, 4, 7);
    expect(
      distance(5, 8, lcs.x1, lcs.y1)
    ).toBeCloseTo(4);
    expect(
      distance(77, 980, lcs.x2, lcs.y2)
    ).toBeCloseTo(7);
    expect(
      normalizeAngle(angleBetween(lcs.x1, lcs.y1, lcs.x2, lcs.y2))
    ).toBeCloseTo(normalizeAngle(b1.angleBetweenCenters(b2)));
  });

  describe('_opacity static method', () => {
    it('paddings sum is too big', () => {
      let b1 = Base.create(svg, 'A', 5, 9);
      let b2 = Base.create(svg, 'T', 8, 13);
      expect(b1.distanceBetweenCenters(b2)).toBeCloseTo(5);
      // note that each padding individually is not too big
      expect(StraightBond._opacity(b1, b2, 2.5, 3.5)).toBe(0);
    });

    it('paddings fit', () => {
      let b1 = Base.create(svg, 't', 1, 5);
      let b2 = Base.create(svg, 'b', 80, 75);
      expect(StraightBond._opacity(b1, b2, 3, 6)).toBe(1);
    });
  });

  describe('constructor', () => {
    let b1 = Base.create(svg, 'a', 1, 2);
    let b2 = Base.create(svg, 'b', 10, 20);

    it('throws on missing line element', () => {
      expect(() => new StraightBond(undefined, b1, b2)).toThrow();
    });

    it('throws on wrong element type', () => {
      let c = svg.circle(20);
      expect(() => new StraightBond(c, b1, b2)).toThrow();
    });

    it('initializes line ID', () => {
      let l = svg.line(1, 2, 6, 8);
      expect(l.attr('id')).toBe(undefined);
      let sb = new StraightBond(l, b1, b2);
      expect(l.attr('id')).toBeTruthy();
    });
  });

  it('id getter', () => {
    let l = svg.line(1, 2, 3, 4);
    l.id('zzxxcc');
    let b1 = Base.create(svg, 'e', 1, 4);
    let b2 = Base.create(svg, 'h', 3, 2);
    let sb = new StraightBond(l, b1, b2);
    expect(sb.id).toBe('zzxxcc');
  });

  it('base1 and base2 getters', () => {
    let l = svg.line(1, 2, 3, 4);
    let b1 = Base.create(svg, 'y', 5, 4);
    let b2 = Base.create(svg, 'n', 4, 5);
    let sb = new StraightBond(l, b1, b2);
    expect(sb.base1).toBe(b1);
    expect(sb.base2).toBe(b2);
  });

  it('contais method', () => {
    let l = svg.line(5, 10, 12, 18);
    let b1 = Base.create(svg, 'g', 1, 1);
    let b2 = Base.create(svg, 'A', 20, 20);
    let sb = new StraightBond(l, b1, b2);
    expect(sb.contains(b1)).toBeTruthy();
    expect(sb.contains(b2)).toBeTruthy();
    let b3 = Base.create(svg, 'a', 5, 10);
    expect(sb.contains(b3)).toBeFalsy();
  });

  it('basePadding1 property', () => {
    let b1 = Base.create(svg, 'e', 800, 900);
    let b2 = Base.create(svg, 'Q', 250, 300);
    let lcs = StraightBond._lineCoordinates(b1, b2, 12, 16);
    let l = svg.line(lcs.x1, lcs.y1, lcs.x2, lcs.y2);
    let sb = new StraightBond(l, b1, b2);
    expect(sb.basePadding1).toBeCloseTo(12); // check getter
    sb.basePadding1 = 26; // use setter
    expect(sb.basePadding1).toBeCloseTo(26); // check getter
    // check actual value
    expect(distance(800, 900, sb.line.attr('x1'), sb.line.attr('y1'))).toBeCloseTo(26);
    expect(sb.basePadding2).toBeCloseTo(16); // maintains base padding 2
  });

  it('basePadding2 property', () => {
    let b1 = Base.create(svg, 'W', 1012, 112);
    let b2 = Base.create(svg, 'g', 510, 850);
    let lcs = StraightBond._lineCoordinates(b1, b2, 10, 20);
    let l = svg.line(lcs.x1, lcs.y1, lcs.x2, lcs.y2);
    let sb = new StraightBond(l, b1, b2);
    expect(sb.basePadding2).toBeCloseTo(20); // check getter
    sb.basePadding2 = 5; // use setter
    expect(sb.basePadding2).toBeCloseTo(5); // check getter
    // check actual value
    expect(distance(510, 850, sb.line.attr('x2'), sb.line.attr('y2'))).toBeCloseTo(5);
    expect(sb.basePadding1).toBeCloseTo(10); // maintains base padding 1
  });

  describe('reposition method', () => {
    it('moves line', () => {
      let b1 = Base.create(svg, 'T', 101, 92);
      let b2 = Base.create(svg, 'b', 312, 256);
      let lcs = StraightBond._lineCoordinates(b1, b2, 15, 28);
      let l = svg.line(lcs.x1, lcs.y1, lcs.x2, lcs.y2);
      let sb = new StraightBond(l, b1, b2);
      b1.moveTo(185, 112);
      b2.moveTo(900, 872);
      sb.reposition();
      expect(distance(185, 112, sb.line.attr('x1'), sb.line.attr('y1'))).toBeCloseTo(15);
      expect(distance(900, 872, sb.line.attr('x2'), sb.line.attr('y2'))).toBeCloseTo(28);
      let baseAngle = b1.angleBetweenCenters(b2);
      let lineAngle = angleBetween(
        sb.line.attr('x1'), sb.line.attr('y1'),
        sb.line.attr('x2'), sb.line.attr('y2'),
      );
      expect(normalizeAngle(lineAngle)).toBeCloseTo(normalizeAngle(baseAngle));
      // maintans paddings
      expect(sb.basePadding1).toBeCloseTo(15);
      expect(sb.basePadding2).toBeCloseTo(28);
    });

    it('updates opacity', () => {
      let b1 = Base.create(svg, 'm', 3, 5);
      let b2 = Base.create(svg, 'y', 500, 400);
      let lcs = StraightBond._lineCoordinates(b1, b2, 6, 8);
      let l = svg.line(lcs.x1, lcs.y1, lcs.x2, lcs.y2);
      let sb = new StraightBond(l, b1, b2);
      expect(sb.line.attr('opacity')).toBe(1);
      b2.moveTo(4, 6);
      sb.reposition();
      expect(sb.line.attr('opacity')).toBe(0);
      b1.moveTo(98, 76);
      sb.reposition();
      expect(sb.line.attr('opacity')).toBe(1);
    });
  });

  it('bringToFront and sendToBack methods', () => {
    let c = svg.circle(50);
    let r = svg.rect(10, 20);
    let b1 = Base.create(svg, 'G', 1, 5);
    let b2 = Base.create(svg, 'T', 100, 120);
    let lcs = StraightBond._lineCoordinates(b1, b2, 8, 8);
    let l = svg.line(lcs.x1, lcs.y1, lcs.x2, lcs.y2);
    let sb = new StraightBond(l, b1, b2);
    let e = svg.ellipse(5, 3);
    expect(sb.line.position()).toBeGreaterThan(0); // not already at back
    // must send all the way to back and not just back one position
    expect(sb.line.position()).toBeGreaterThan(1);
    sb.sendToBack();
    expect(sb.line.position()).toBe(0); // sent to back
    let frontMarker = svg.circle(10);
    sb.bringToFront();
    expect(sb.line.position()).toBeGreaterThan(frontMarker.position()); // brought to front
    // must have been brought all the way to front and not just forward one position
    expect(sb.line.position()).toBeGreaterThan(1);
  });

  it('refreshIds method', () => {
    let l = svg.line(1, 2, 3, 4);
    let b1 = Base.create(svg, 'a', 1, 4);
    let b2 = Base.create(svg, 'h', 5, 5);
    let sb = new StraightBond(l, b1, b2);
    let oldId = sb.line.id();
    sb.refreshIds();
    expect(sb.line.id()).not.toBe(oldId);
  });
});
