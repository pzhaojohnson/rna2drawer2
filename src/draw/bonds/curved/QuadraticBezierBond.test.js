import { QuadraticBezierBond } from './QuadraticBezierBond';
import NodeSVG from 'Draw/NodeSVG';
import Base from 'Draw/Base';
import { distance2D as distance } from 'Math/distance';
import angleBetween from 'Draw/angleBetween';
import normalizeAngle from 'Draw/normalizeAngle';

let svg = NodeSVG();

describe('QuadraticBezierBond class', () => {
  it('_dPath static method', () => {
    let b1 = Base.create(svg, 'Q', 2, 8);
    let b2 = Base.create(svg, 'B', 45, 200);
    let d = QuadraticBezierBond._dPath(b1, b2, 10, 12, 98, 2 * Math.PI / 3);
    let p = svg.path(d);
    let pa = p.array();
    let m = pa[0];
    let q = pa[1];
    expect(distance(b1.xCenter, b1.yCenter, m[1], m[2])).toBeCloseTo(10);
    expect(distance(b2.xCenter, b2.yCenter, q[3], q[4])).toBeCloseTo(12);
    let xMiddle = (b1.xCenter + b2.xCenter) / 2;
    let yMiddle = (b1.yCenter + b2.yCenter) / 2;
    expect(distance(xMiddle, yMiddle, q[1], q[2])).toBeCloseTo(98);
    let ca = angleBetween(xMiddle, yMiddle, q[1], q[2]);
    let a12 = b1.angleBetweenCenters(b2);
    expect(normalizeAngle(ca, a12) - a12).toBeCloseTo(2 * Math.PI / 3);
  });

  describe('constructor', () => {
    let b1 = Base.create(svg, 'a', 5, 10);
    let b2 = Base.create(svg, 'Q', 100, 200);

    it('throws on missing path element', () => {
      expect(() => new QuadraticBezierBond(undefined, b1, b2)).toThrow();
    });

    it('throws on wrong element type', () => {
      let c = svg.circle(20);
      expect(() => new QuadraticBezierBond(c, b1, b2)).toThrow();
    });

    it('initializes path ID', () => {
      let d = QuadraticBezierBond._dPath(b1, b2, 5, 5, 20, Math.PI / 2);
      let p = svg.path(d);
      expect(p.attr('id')).toBe(undefined);
      let qbb = new QuadraticBezierBond(p, b1, b2);
      expect(p.attr('id')).toBeTruthy();
    });

    it('sets path fill opacity to zero', () => {
      let d = QuadraticBezierBond._dPath(b1, b2, 10, 15, 10, Math.PI / 3);
      let p = svg.path(d);
      p.attr({ 'fill-opacity': 1 });
      let qbb = new QuadraticBezierBond(p, b1, b2);
      expect(p.attr('fill-opacity')).toBe(0);
    });

    it('throws on wrong path segments', () => {
      let p = svg.path('M 1 2 Q 1 5 8 9 Q 2 10 11 20'); // too many segments
      expect(() => new QuadraticBezierBond(p, b1, b2)).toThrow();
      p = svg.path('L 1 2 Q 1 5 10 15'); // first segment is not M
      expect(() => new QuadraticBezierBond(p, b1, b2)).toThrow();
      p = svg.path('M 5 8 L 5 9'); // second segment is not Q
      expect(() => new QuadraticBezierBond(p, b1, b2)).toThrow();
    });
  });

  it('id and base getters', () => {
    let p = svg.path('M 1 2 Q 4 5 6 7');
    p.id('asdfzxcv');
    let b1 = Base.create(svg, 'h', 1, 5);
    let b2 = Base.create(svg, 'y', 1, 1);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    expect(qbb.id).toBe('asdfzxcv');
    expect(qbb.base1).toBe(b1);
    expect(qbb.base2).toBe(b2);
  });

  it('contains method', () => {
    let p = svg.path('M 1 2 Q 4 5 6 7');
    let b1 = Base.create(svg, 'h', 1, 5);
    let b2 = Base.create(svg, 'y', 1, 1);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    expect(qbb.contains(b1)).toBeTruthy();
    expect(qbb.contains(b2)).toBeTruthy();
    let b3 = Base.create(svg, 'b', 2, 2);
    expect(qbb.contains(b3)).toBeFalsy();
  });

  it('x1, y1, x2, y2, xControl and yControl getters', () => {
    let p = svg.path('M 1.2 4.3 Q 100 200.3 30 45.5');
    let b1 = Base.create(svg, 'b', 1, 2);
    let b2 = Base.create(svg, 'n', 4, 4);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    expect(qbb.x1).toBeCloseTo(1.2);
    expect(qbb.y1).toBeCloseTo(4.3);
    expect(qbb.x2).toBeCloseTo(30);
    expect(qbb.y2).toBeCloseTo(45.5);
    expect(qbb.xControl).toBeCloseTo(100);
    expect(qbb.yControl).toBeCloseTo(200.3);
  });

  it('padding1 getter and setter', () => {
    let b1 = Base.create(svg, 'a', 100, 200);
    let b2 = Base.create(svg, 'q', 500, 800);
    let d = QuadraticBezierBond._dPath(b1, b2, 12, 20, 100, Math.PI / 3);
    let p = svg.path(d);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    expect(qbb.getPadding1()).toBeCloseTo(12); // check getter
    qbb.setPadding1(30); // use setter
    expect(qbb.getPadding1()).toBeCloseTo(30); // check getter
    // check actual value
    expect(distance(100, 200, qbb.x1, qbb.y1)).toBeCloseTo(30);
    // maintains other aspects of path positioning
    expect(qbb.getPadding2()).toBeCloseTo(20);
    expect(qbb._controlHeight).toBeCloseTo(100);
    expect(normalizeAngle(qbb._controlAngle)).toBeCloseTo(Math.PI / 3);
  });

  it('padding2 getter and setter', () => {
    let b1 = Base.create(svg, 'q', 800, 1000);
    let b2 = Base.create(svg, 'a', 200, 500);
    let d = QuadraticBezierBond._dPath(b1, b2, 10, 18, 25, 2 * Math.PI / 3);
    let p = svg.path(d);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    expect(qbb.getPadding2()).toBeCloseTo(18); // check getter
    qbb.setPadding2(28); // use setter
    expect(qbb.getPadding2()).toBeCloseTo(28); // check getter
    // check actual value
    expect(distance(200, 500, qbb.x2, qbb.y2)).toBeCloseTo(28);
    // maintains other aspects of path positioning
    expect(qbb.getPadding1()).toBeCloseTo(10);
    expect(qbb._controlHeight).toBeCloseTo(25);
    expect(normalizeAngle(qbb._controlAngle)).toBeCloseTo(2 * Math.PI / 3);
  });

  it('shiftControl method', () => {
    let b1 = Base.create(svg, 'T', 20, 30);
    let b2 = Base.create(svg, 'b', 2000, 300);
    let d = QuadraticBezierBond._dPath(b1, b2, 8, 12, 300, Math.PI / 3);
    let p = svg.path(d);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    let unshifted = p.array();
    qbb.shiftControl(-50, 120);
    let shifted = p.array();
    // check control coordinates
    expect(shifted[1][1]).toBeCloseTo(unshifted[1][1] - 50);
    expect(shifted[1][2]).toBeCloseTo(unshifted[1][2] + 120);
    // maintains paddings
    expect(qbb.getPadding1()).toBeCloseTo(8);
    expect(qbb.getPadding2()).toBeCloseTo(12);
  });

  it('reposition method', () => {
    let b1 = Base.create(svg, 'H', 4, 9);
    let b2 = Base.create(svg, 'j', -2000, -500);
    let d = QuadraticBezierBond._dPath(b1, b2, 20, 15, 1000, 2 * Math.PI / 3);
    let p = svg.path(d);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    b1.moveTo(200, 259);
    b2.moveTo(-2500, -800);
    qbb.reposition();
    // check padding1
    expect(qbb.getPadding1()).toBeCloseTo(20); // check getter
    expect(distance(200, 259, qbb.x1, qbb.y1)).toBeCloseTo(20); // check actual value
    // check padding2
    expect(qbb.getPadding2()).toBeCloseTo(15); // check getter
    expect(distance(-2500, -800, qbb.x2, qbb.y2)).toBeCloseTo(15); // check actual value
    // check control coordinates
    let xMiddle = (b1.xCenter + b2.xCenter) / 2;
    let yMiddle = (b1.yCenter + b2.yCenter) / 2;
    expect(distance(xMiddle, yMiddle, qbb.xControl, qbb.yControl)).toBeCloseTo(1000);
    let ca = angleBetween(xMiddle, yMiddle, qbb.xControl, qbb.yControl);
    let a12 = b1.angleBetweenCenters(b2);
    expect(normalizeAngle(ca, a12) - a12).toBeCloseTo(2 * Math.PI / 3);
  });

  it('fill, fillOpacity and cursor getters and setters', () => {
    let b1 = Base.create(svg, 'A', 10, 20);
    let b2 = Base.create(svg, 'g', 800, 200);
    let d = QuadraticBezierBond._dPath(b1, b2, 10, 50, 80, Math.PI / 5);
    let p = svg.path(d);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    qbb.fill = '#1324ab'; // use setter
    expect(qbb.fill).toBe('#1324ab'); // check getter
    expect(qbb.path.attr('fill')).toBe('#1324ab'); // check actual value
    qbb.fillOpacity = 0.29; // use setter
    expect(qbb.fillOpacity).toBe(0.29); // check getter
    expect(qbb.path.attr('fill-opacity')).toBe(0.29); // check actual value
    expect(qbb.cursor).not.toBe('pointer'); // below test of setter will be valid
    qbb.cursor = 'pointer'; // use setter
    expect(qbb.cursor).toBe('pointer'); // check getter
    expect(p.css('cursor')).toBe('pointer'); // check actual value
  });

  it('bringToFront and sendToBack methods', () => {
    let c1 = svg.circle(33);
    let r1 = svg.rect(1, 8);
    let r2 = svg.rect(30, 20);
    let b1 = Base.create(svg, 'A', 10, 20);
    let b2 = Base.create(svg, 'g', 800, 200);
    let d = QuadraticBezierBond._dPath(b1, b2, 10, 50, 80, Math.PI / 5);
    let p = svg.path(d);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    let r3 = svg.rect(2, 2);
    let c2 = svg.circle(50);
    expect(qbb.path.position()).toBeGreaterThan(0); // not already at back
    // must be sent all the way to back and not just back one position
    expect(qbb.path.position()).toBeGreaterThan(1);
    qbb.sendToBack();
    expect(qbb.path.position()).toBe(0); // sent to back
    let frontMarker = svg.ellipse(2, 6);
    qbb.bringToFront();
    expect(qbb.path.position()).toBeGreaterThan(frontMarker.position()); // brought to front
    // must have been brought all the way to front and not just forward one position
    expect(qbb.path.position()).toBeGreaterThan(1);
  });

  describe('binding events', () => {
    let b1 = Base.create(svg, 'b', 1, 2);
    let b2 = Base.create(svg, 'r', 5, 9);
    let d = QuadraticBezierBond._dPath(b1, b2, 7, 8, 25, Math.PI / 3);
    let p = svg.path(d);
    let qbb = new QuadraticBezierBond(p, b1, b2);

    it('onMouseover method', () => {
      let f = jest.fn();
      qbb.onMouseover(f);
      p.fire('mouseover');
      expect(f).toHaveBeenCalled();
    });

    it('onMouseout method', () => {
      let f = jest.fn();
      qbb.onMouseout(f);
      p.fire('mouseout');
      expect(f).toHaveBeenCalled();
    });

    it('onMousedown method', () => {
      let f = jest.fn();
      qbb.onMousedown(f);
      p.fire('mousedown');
      expect(f).toHaveBeenCalled();
    });

    it('onDblclick method', () => {
      let f = jest.fn();
      qbb.onDblclick(f);
      p.fire('dblclick');
      expect(f).toHaveBeenCalled();
    });
  });

  it('remove and hasBeenRemoved methods', () => {
    let p = svg.path('M 1 2 Q 3 4 5 6');
    let b1 = Base.create(svg, 'v', 1, 2);
    let b2 = Base.create(svg, 'n', 5, 10);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    let id = '#' + p.id();
    expect(svg.findOne(id)).toBeTruthy();
    expect(qbb.hasBeenRemoved()).toBeFalsy();
    qbb.remove();
    expect(svg.findOne(id)).toBeFalsy();
    expect(qbb.hasBeenRemoved()).toBeTruthy();
  });

  describe('savableState method', () => {
    it('includes className, path and bases', () => {
      let p = svg.path('M 1 2 Q 5 5 6 7');
      let b1 = Base.create(svg, 'b', 1, 5);
      let b2 = Base.create(svg, 'N', 5, 3);
      let qbb = new QuadraticBezierBond(p, b1, b2);
      let savableState = qbb.savableState();
      expect(savableState.className).toBe('QuadraticBezierBond');
      expect(savableState.pathId).toBe(p.id());
      expect(savableState.baseId1).toBe(b1.id);
      expect(savableState.baseId2).toBe(b2.id);
    });

    it('can be converted to and from a JSON string', () => {
      let p = svg.path('M 1 2 Q 5 5 6 7');
      let b1 = Base.create(svg, 'b', 1, 5);
      let b2 = Base.create(svg, 'N', 5, 3);
      let qbb = new QuadraticBezierBond(p, b1, b2);
      let savableState = qbb.savableState();
      let json = JSON.stringify(savableState);
      let parsed = JSON.parse(json);
      expect(JSON.stringify(parsed)).toBe(json);
    });
  });

  it('refreshIds method', () => {
    let p = svg.path('M 1 2 Q 5 5 6 7');
    let b1 = Base.create(svg, 'b', 1, 5);
    let b2 = Base.create(svg, 'N', 5, 3);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    let oldId = qbb.path.id();
    qbb.refreshIds();
    expect(qbb.path.id()).not.toBe(oldId);
  });
});

function getBasebyId(id, bases) {
  let i = null;
  bases.forEach((b, j) => {
    if (b.id === id) {
      i = j;
    }
  });
  return bases[i];
}
