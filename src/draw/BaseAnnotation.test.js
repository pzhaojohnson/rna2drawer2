import { CircleBaseAnnotation } from './BaseAnnotation';
import NodeSVG from './NodeSVG';
import { distance2D as distance } from 'Math/distance';

let svg = NodeSVG();

describe('CircleBaseAnnotation class', () => {
  describe('fromSavedState static method', () => {
    it('valid saved state', () => {
      let cba1 = CircleBaseAnnotation.createNondisplaced(svg, 19.6, 100.1);
      let savableState = cba1.savableState();
      let cba2 = CircleBaseAnnotation.fromSavedState(savableState, svg, 19.6, 100.1);
      expect(cba2.circle.id()).toBe(savableState.circleId);
      expect(cba2.circle.attr('cx')).toBeCloseTo(19.6);
      expect(cba2.circle.attr('cy')).toBeCloseTo(100.1);
    });

    describe('invalid saved state', () => {
      it('wrong className', () => {
        let cba = CircleBaseAnnotation.createNondisplaced(svg, 0, 4);
        let savableState = cba.savableState();
        savableState.className = 'CircleBseAnnotation';
        expect(
          () => CircleBaseAnnotation.fromSavedState(savableState, svg, 0, 4)
        ).toThrow();
      });

      it('no circle has saved ID', () => {
        let cba = CircleBaseAnnotation.createNondisplaced(svg, -1, 5);
        let savableState = cba.savableState();
        savableState.circleId = 'asdf';
        expect(
          () => CircleBaseAnnotation.fromSavedState(savableState, svg, -1, 5)
        ).toThrow();
      });
    });
  });

  it('createNondisplaced static method', () => {
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1.5, 3);
    expect(cba.circle.attr('cx')).toBeCloseTo(1.5);
    expect(cba.circle.attr('cy')).toBeCloseTo(3);
  });

  describe('constructor', () => {
    it('throws on missing circle argument', () => {
      expect(() => new CircleBaseAnnotation(undefined, 1, 2)).toThrow();
    });

    it('throws on wrong SVG element type', () => {
      let r = svg.rect(10, 20);
      expect(() => new CircleBaseAnnotation(r, 5, 6)).toThrow();
    });

    it('initializes circle ID', () => {
      let c = svg.circle(15);
      expect(c.attr('id')).toBe(undefined);
      let cba = new CircleBaseAnnotation(c, 1, 1);
      expect(c.attr('id')).toBeTruthy();
    });
  });

  it('id getter', () => {
    let c = svg.circle(8);
    c.id('asdfasdf');
    let cba = new CircleBaseAnnotation(c, 0, 0);
    expect(cba.id).toBe('asdfasdf');
  });

  describe('reposition method', () => {
    it('repositions circle', () => {
      let c = svg.circle(20);
      c.attr({ 'cx': 5.68, 'cy': 205.2 });
      let cba = new CircleBaseAnnotation(c, 32, 156);
      cba.reposition(200.6, 129);
      expect(distance(200.6, 129, c.attr('cx'), c.attr('cy'))).toBeCloseTo(0);
    });
  });

  it('bringToFront and sendToBack methods', () => {
    let r = svg.rect(10, 20);
    let l = svg.line(1, 2, 3, 4);
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 5, 10);
    expect(cba.circle.position()).toBeGreaterThan(0); // not already at back
    // must be sent all the way to back and not just backwards one position
    expect(cba.circle.position()).toBeGreaterThan(1);
    cba.sendToBack();
    expect(cba.circle.position()).toBe(0); // sent to back
    let frontMarker = svg.ellipse(20, 30);
    cba.bringToFront();
    expect(cba.circle.position()).toBeGreaterThan(frontMarker.position()); // brought to front
    // had to be brought all the way to front and not just forward one position
    expect(cba.circle.position()).toBeGreaterThan(1);
  });

  describe('pulsateBetween method', () => {
    // It seems that any use of the animate method on an SVG element
    // when running with Node.js throws with the error "Cannot read
    // property 'now' of undefined". The animate method does seem to
    // work in web browsers, though.
    // TODO: Open or a find a GitHub issue on this.
    it('placeholder test', () => {});
    /*
    it('with all undefined props', () => {
      let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
      expect(() => cba.pulsateBetween({})).not.toThrow();
    });

    it('with all defined props', () => {
      let cba = CircleBaseAnnotation.createNondisplaced(svg, 100, 200);
      expect(() => cba.pulsateBetween({
        radius: 12,
        fill: '#00ff00',
        fillOpacity: 0.56,
        stroke: '#ffaa22',
        strokeWidth: 10,
        strokeOpacity: 0.11,
      })).not.toThrow();
    });

    it('chained calls', () => {
      let cba = CircleBaseAnnotation.createNondisplaced(svg, 50, 60);
      cba.pulsateBetween({ fill: '#ff55bb' });
      expect(() => cba.pulsateBetween({ fill: '#aa1100' })).not.toThrow();
    });
    */
  });

  it('remove method removes circle', () => {
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 0.1, 2.6);
    let id = '#' + cba.circle.id();
    expect(svg.findOne(id)).toBeTruthy();
    cba.remove();
    expect(svg.findOne(id)).toBe(null);
  });

  describe('savableState method', () => {
    it('includes className and circle ID', () => {
      let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
      let savableState = cba.savableState();
      expect(savableState.className).toBe('CircleBaseAnnotation');
      expect(savableState.circleId).toBe(cba.circle.id());
    });

    it('can be converted to and from a JSON string', () => {
      let cba1 = CircleBaseAnnotation.createNondisplaced(svg, 5, 9);
      let savableState = cba1.savableState();
      let json = JSON.stringify(savableState);
      let parsed = JSON.parse(json);
      expect(JSON.stringify(parsed)).toBe(json);
    });
  });

  it('refreshIds method', () => {
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 10, 50);
    let oldId = cba.circle.id();
    cba.refreshIds();
    expect(cba.circle.id()).not.toBe(oldId);
  });
});
