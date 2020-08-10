import { CircleBaseAnnotation } from './BaseAnnotation';
import NodeSVG from './NodeSVG';
import normalizeAngle from './normalizeAngle';
import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';

let svg = NodeSVG();

describe('CircleBaseAnnotation class', () => {
  describe('mostRecentProps static method', () => {
    let mrps = CircleBaseAnnotation.mostRecentProps();
    expect(mrps).not.toBe(CircleBaseAnnotation._mostRecentProps); // is a new object
    expect(mrps).toStrictEqual(CircleBaseAnnotation._mostRecentProps);
  });

  describe('applying and copying to most recent props', () => {
    let props = Object.keys(CircleBaseAnnotation.mostRecentProps());
    let cba1 = CircleBaseAnnotation.createNondisplaced(svg, 3, 5);
    let cba2 = CircleBaseAnnotation.createNondisplaced(svg, 5, 55);
    cba1.radius = 55.02;
    cba1.fill = '#43bacc';
    cba1.fillOpacity = 0.42;
    cba1.stroke = '#aabbcd';
    cba1.strokeWidth = 12.2;
    cba1.strokeOpacity = 0.91;
    CircleBaseAnnotation._copyPropsToMostRecent(cba1);
    let mrps = CircleBaseAnnotation.mostRecentProps();
    props.forEach(p => expect(mrps[p]).toBe(cba1[p]));
    CircleBaseAnnotation._applyMostRecentProps(cba2);
    props.forEach(p => expect(cba2[p]).toBe(mrps[p]));
  });

  describe('fromSavedState static method', () => {
    it('valid saved state', () => {
      let cba1 = CircleBaseAnnotation.createNondisplaced(svg, 19.6, 100.1);
      cba1.shift(17.4, -12.3);
      let dl = cba1.displacementLength;
      let da = cba1.displacementAngle;
      let savableState = cba1.savableState();
      let spy = jest.spyOn(CircleBaseAnnotation, '_copyPropsToMostRecent');
      let cba2 = CircleBaseAnnotation.fromSavedState(savableState, svg, 19.6, 100.1);
      expect(cba2._circle.id()).toBe(savableState.circleId);
      // requires that base center coordinates were passed correctly
      expect(cba2.displacementLength).toBeCloseTo(dl);
      expect(cba2.displacementAngle).toBeCloseTo(da);
      expect(spy.mock.calls[0][0]).toBe(cba2); // copies props to most recent
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
    let spy = jest.spyOn(CircleBaseAnnotation, '_applyMostRecentProps');
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1.5, 3);
    expect(cba.xCenter).toBeCloseTo(1.5);
    expect(cba.yCenter).toBeCloseTo(3);
    expect(spy.mock.calls[0][0]).toBe(cba); // applies most recent props
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
  
  it('type getter', () => {
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    expect(cba.type).toBe('circle');
  })

  it('id getter', () => {
    let c = svg.circle(8);
    c.id('asdfasdf');
    let cba = new CircleBaseAnnotation(c, 0, 0);
    expect(cba.id).toBe('asdfasdf');
  });

  it('xCenter and yCenter getters', () => {
    let c = svg.circle(50);
    c.attr({ 'cx': 1000.12, 'cy': -205.1 });
    let cba = new CircleBaseAnnotation(c, 20, 50);
    expect(cba.xCenter).toBeCloseTo(1000.12);
    expect(cba.yCenter).toBeCloseTo(-205.1);
  });

  it('displacementLength and displacementAngle getters', () => {
    let c = svg.circle(20);
    c.attr({ 'cx': 120, 'cy': 488 });
    let cba = new CircleBaseAnnotation(c, 100, 467);
    expect(cba.displacementLength).toBeCloseTo(29);
    let da = normalizeAngle(cba.displacementAngle);
    expect(da).toBeCloseTo(Math.asin(21 / 29));
  });

  describe('shift method', () => {
    it('shifts the circle', () => {
      let cba = CircleBaseAnnotation.createNondisplaced(svg, 5, 9);
      cba.shift(4, 3);
      expect(cba.xCenter).toBeCloseTo(9);
      expect(cba.yCenter).toBeCloseTo(12);
      cba.shift(-5, 23);
      expect(cba.xCenter).toBeCloseTo(4);
      expect(cba.yCenter).toBeCloseTo(35);
    });

    it('updates displacement', () => {
      let cba = CircleBaseAnnotation.createNondisplaced(svg, -2, 19);
      cba.shift(9, 40);
      expect(cba.displacementLength).toBeCloseTo(41);
      let da = normalizeAngle(cba.displacementAngle);
      expect(da).toBeCloseTo(Math.asin(40 / 41));
      cba.shift(-29, -61);
      expect(cba.displacementLength).toBeCloseTo(29);
      da = normalizeAngle(cba.displacementAngle);
      expect(da).toBeCloseTo(Math.PI + Math.asin(21 / 29));
    });
  });

  describe('reposition method', () => {
    it('repositions circle while maintaining displacement', () => {
      let c = svg.circle(20);
      c.attr({ 'cx': 5.68, 'cy': 205.2 });
      let cba = new CircleBaseAnnotation(c, 32, 156);
      let dl = cba.displacementLength;
      let da = normalizeAngle(cba.displacementAngle);
      cba.reposition(200.6, 129);
      expect(distanceBetween(200.6, 129, c.attr('cx'), c.attr('cy'))).toBeCloseTo(dl);
      let a = angleBetween(200.6, 129, c.attr('cx'), c.attr('cy'));
      expect(normalizeAngle(a)).toBeCloseTo(da);
      // check displacement getters as well
      expect(cba.displacementLength).toBeCloseTo(dl);
      expect(normalizeAngle(cba.displacementAngle)).toBeCloseTo(da);
    });
  });

  it('insertBefore and insertAfter methods', () => {
    let r = svg.rect(1, 5);
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    expect(cba._circle.position()).toBeGreaterThan(r.position());
    cba.insertBefore(r);
    expect(cba._circle.position()).toBeLessThan(r.position());
    cba.insertAfter(r);
    expect(cba._circle.position()).toBeGreaterThan(r.position());
  });

  it('back method', () => {
    let r = svg.rect(10, 20);
    let l = svg.line(1, 2, 3, 4);
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 5, 10);
    expect(cba._circle.position()).toBeGreaterThan(0);
    cba.back();
    expect(cba._circle.position()).toBe(0);
  });

  it('radius getter and setter', () => {
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 5, 8);
    cba.radius = 8.05;
    expect(cba.radius).toBeCloseTo(8.05); // check getter
    expect(cba._circle.attr('r')).toBeCloseTo(8.05); // check actual value
    // updates most recent prop
    expect(CircleBaseAnnotation.mostRecentProps().radius).toBe(8.05);
  });

  it('fill getter and setter', () => {
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 8, 5);
    cba.fill = '#654321';
    expect(cba.fill).toBe('#654321'); // check getter
    expect(cba._circle.attr('fill')).toBe('#654321'); // check actual value
    // updates most recent prop
    expect(CircleBaseAnnotation.mostRecentProps().fill).toBe('#654321');
  });

  it('fillOpacity getter and setter', () => {
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 9, 2);
    cba.fillOpacity = 0.62;
    expect(cba.fillOpacity).toBe(0.62); // check getter
    expect(cba._circle.attr('fill-opacity')).toBe(0.62); // check actual value
    // updates most recent prop
    expect(CircleBaseAnnotation.mostRecentProps().fillOpacity).toBe(0.62);
  });

  it('stroke getter and setter', () => {
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 11, 25);
    cba.stroke = '#abcdef';
    expect(cba.stroke).toBe('#abcdef'); // check getter
    expect(cba._circle.attr('stroke')).toBe('#abcdef'); // check actual value
    // updates most recent prop
    expect(CircleBaseAnnotation.mostRecentProps().stroke).toBe('#abcdef');
  });

  it('strokeWidth getter and setter', () => {
    let cba = CircleBaseAnnotation.createNondisplaced(svg, -1, 21);
    cba.strokeWidth = 5.51;
    expect(cba.strokeWidth).toBe(5.51); // check getter
    expect(cba._circle.attr('stroke-width')).toBe(5.51); // check actual value
    // updates most recent prop
    expect(CircleBaseAnnotation.mostRecentProps().strokeWidth).toBe(5.51);
  });

  it('strokeOpacity getter and setter', () => {
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 10, 92);
    cba.strokeOpacity = 0.36;
    expect(cba.strokeOpacity).toBe(0.36); // check getter
    expect(cba._circle.attr('stroke-opacity')).toBe(0.36); // check actual value
    // updates most recent prop
    expect(CircleBaseAnnotation.mostRecentProps().strokeOpacity).toBe(0.36);
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
    let id = '#' + cba._circle.id();
    expect(svg.findOne(id)).toBeTruthy();
    cba.remove();
    expect(svg.findOne(id)).toBe(null);
  });

  describe('savableState method', () => {
    it('includes className and circle ID', () => {
      let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
      let savableState = cba.savableState();
      expect(savableState.className).toBe('CircleBaseAnnotation');
      expect(savableState.circleId).toBe(cba._circle.id());
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
    let oldId = cba._circle.id();
    cba.refreshIds();
    expect(cba._circle.id()).not.toBe(oldId);
  });
});
