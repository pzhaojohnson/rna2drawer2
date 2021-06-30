import { CircleBaseAnnotation } from './CircleBaseAnnotation';
import { NodeSVG } from 'Draw/NodeSVG';
import { SVGCircleWrapper as CircleWrapper } from 'Draw/svg/circle';
import { uuidRegex } from 'Draw/svg/id';

let svg = NodeSVG();

describe('CircleBaseAnnotation class', () => {
  describe('constructor', () => {
    it('checks wrapped SVG element type', () => {
      let r = new CircleWrapper(svg.rect(10, 20));
      expect(
        () => new CircleBaseAnnotation(r, { x: 5, y: 6 })
      ).toThrow();
    });

    it('stores reference to circle', () => {
      let c = new CircleWrapper(svg.circle(20));
      let cba = new CircleBaseAnnotation(c, { x: 50, y: 60 });
      expect(cba.circle).toBe(c);
    });

    it('initializes falsy circle IDs with UUIDs', () => {
      [undefined, ''].forEach(v => {
        let c = new CircleWrapper(svg.circle(30));
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
      let c = new CircleWrapper(svg.circle(50));
      c.attr({ 'id': 'circleId132435' });
      let cba = new CircleBaseAnnotation(c, { x: 50, y: 100 });
      expect(c.attr('id')).toBe('circleId132435');
    });

    it('caches base center', () => {
      let c = new CircleWrapper(svg.circle(20));
      let cba = new CircleBaseAnnotation(c, { x: 601.1, y: 233 });
      c.attr({ 'cx': 100, 'cy': 50 });
      expect(c.attr('cx')).toBeCloseTo(100);
      expect(c.attr('cy')).toBeCloseTo(50);
      // must use base center cached by constructor
      cba.reposition();
      expect(c.attr('cx')).toBeCloseTo(601.1);
      expect(c.attr('cy')).toBeCloseTo(233);
    });
  });

  it('id getter', () => {
    let c = new CircleWrapper(svg.circle(8));
    c.id('asdfasdf');
    let cba = new CircleBaseAnnotation(c, { x: 0, y: 0 });
    expect(cba.id).toBe('asdfasdf');
  });

  describe('reposition method', () => {
    it('centers circle on given base center', () => {
      let c = new CircleWrapper(svg.circle(20));
      let cba = new CircleBaseAnnotation(c, { x: 32, y: 156 });
      c.attr({ 'cx': 5.68, 'cy': 205.2 });
      cba.reposition({ baseCenter: { x: 200.6, y: 129 } });
      expect(c.attr('cx')).toBeCloseTo(200.6);
      expect(c.attr('cy')).toBeCloseTo(129);
    });

    it('caches base center and can use cached base center', () => {
      let c = new CircleWrapper(svg.circle(60));
      let cba = new CircleBaseAnnotation(c, { x: 50, y: 150 });
      // must cache the given base center
      cba.reposition({ baseCenter: { x: 455.2, y: 812.3 } });
      c.attr({ 'cx': 235, 'cy': 230 });
      expect(c.attr('cx')).toBeCloseTo(235);
      expect(c.attr('cy')).toBeCloseTo(230);
      cba.reposition(); // with no arguments
      expect(c.attr('cx')).toBeCloseTo(455.2);
      expect(c.attr('cy')).toBeCloseTo(812.3);
      c.attr({ 'cx': 655, 'cy': 243 });
      expect(c.attr('cx')).toBeCloseTo(655);
      expect(c.attr('cy')).toBeCloseTo(243);
      cba.reposition({}); // with falsy base center
      expect(c.attr('cx')).toBeCloseTo(455.2);
      expect(c.attr('cy')).toBeCloseTo(812.3);
    });
  });

  it('bringToFront and sendToBack methods', () => {
    let c = new CircleWrapper(svg.circle(50));
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
    let c = new CircleWrapper(svg.circle(10));
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
