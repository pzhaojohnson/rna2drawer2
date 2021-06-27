import { CircleBaseAnnotation } from './CircleBaseAnnotation';
import { NodeSVG } from 'Draw/NodeSVG';
import { distance2D as distance } from 'Math/distance';
import { uuidRegex } from 'Draw/svg/id';

let svg = NodeSVG();

describe('CircleBaseAnnotation class', () => {
  describe('constructor', () => {
    it('throws on missing circle argument', () => {
      expect(() => new CircleBaseAnnotation(undefined, { x: 1, y: 2 })).toThrow();
    });

    it('throws on wrong SVG element type', () => {
      let r = svg.rect(10, 20);
      expect(() => new CircleBaseAnnotation(r, { x: 5, y: 6 })).toThrow();
    });

    it('initializes falsy circle IDs with UUIDs', () => {
      [undefined, ''].forEach(v => {
        let c = svg.circle(30);
        c.attr({ 'id': v });
        // use the attr method to check the value of an ID
        // since the id method itself will initialize IDs
        expect(c.attr('id')).toBe(v);
        let cba = new CircleBaseAnnotation(c, { x: 5, y: 10 });
        expect(c.attr('id')).toMatch(uuidRegex);
      });
    });

    it("doesn't overwrite circle IDs", () => {
      // it is important that IDs aren't overwritten
      // when opening a saved drawing since elements
      // in the drawing may reference other elements
      // using saved IDs (e.g., bonds referencing their
      // bases)
      let c = svg.circle(50);
      c.attr({ 'id': 'circleId132435' });
      let cba = new CircleBaseAnnotation(c, { x: 50, y: 100 });
      expect(c.attr('id')).toBe('circleId132435');
    });
  });

  it('id getter', () => {
    let c = svg.circle(8);
    c.id('asdfasdf');
    let cba = new CircleBaseAnnotation(c, { x: 0, y: 0 });
    expect(cba.id).toBe('asdfasdf');
  });

  describe('reposition method', () => {
    it('repositions circle', () => {
      let c = svg.circle(20);
      c.attr({ 'cx': 5.68, 'cy': 205.2 });
      let cba = new CircleBaseAnnotation(c, { x: 32, y: 156 });
      cba.reposition({ x: 200.6, y: 129 });
      expect(distance(200.6, 129, c.attr('cx'), c.attr('cy'))).toBeCloseTo(0);
    });
  });

  it('bringToFront and sendToBack methods', () => {
    let c = svg.circle(50);
    let cba = new CircleBaseAnnotation(c, { x: 25, y: 250 });
    let r = svg.rect(10, 20);
    let l = svg.line(1, 2, 3, 4);
    let t = svg.text('asdf');
    cba.bringToFront();
    // must send all the way to the back and not just back
    // one position
    cba.sendToBack();
    expect(c.position()).toBe(0);
    // must bring all the way to the front and not just
    // forward one position
    cba.bringToFront();
    expect(c.position()).toBeGreaterThanOrEqual(3);
  });

  it('refreshIds method', () => {
    let c = svg.circle(10);
    let cba = new CircleBaseAnnotation(c, { x: 20, y: 30 });
    let prevId = c.id();
    expect(prevId).toBeTruthy(); // ID was initialized
    cba.refreshIds();
    expect(c.id()).not.toEqual(prevId);
    // check that ID was redefined (and not undefined)
    expect(c.id()).toBeTruthy();
    expect(c.id()).toMatch(uuidRegex);
  });
});
