import {
  BaseAnnotation,
  CircleBaseAnnotation,
} from './BaseAnnotation';
import createNodeSVG from './createNodeSVG';
import distanceBetween from './distanceBetween';
import normalizeAngle from './normalizeAngle';
import angleBetween from './angleBetween';

describe('CircleBaseAnnotation class', () => {
  describe('fromSavedState static method', () => {
    it('valid saved state', () => {
      let svg = createNodeSVG();
      let cba1 = CircleBaseAnnotation.createNondisplaced(svg, 1, 10);
      cba1.shift(3, 5, 1, 10);
      let savableState1 = cba1.savableState();
      let cba2 = CircleBaseAnnotation.fromSavedState(savableState1, svg, 1, 10);
      let savableState2 = cba2.savableState();
      expect(JSON.stringify(savableState2)).toBe(JSON.stringify(savableState1));
    });

    describe('invalid cases', () => {
      it('wrong className', () => {
        let svg = createNodeSVG();
        let cba = CircleBaseAnnotation.createNondisplaced(svg, 0, 4);
        cba.shift(2, 3, 0, 4);
        let savableState = cba.savableState();
        savableState.className = 'CircleBseAnnotation';
        expect(
          CircleBaseAnnotation.fromSavedState(savableState, svg, 0, 4)
        ).toBe(null);
      });

      it('circle does not exist', () => {
        let svg = createNodeSVG();
        let cba = CircleBaseAnnotation.createNondisplaced(svg, -1, 5);
        let savableState = cba.savableState();
        savableState.circle = 'asdf';
        expect(svg.findOne('#' + 'asdf')).toBe(null);
        expect(
          CircleBaseAnnotation.fromSavedState(savableState, svg, -1, 5)
        ).toBe(null);
      });
    });
  });
  
  it('createNondisplaced static method', () => {
    let svg = createNodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1.5, 3);
    expect(cba.xCenter).toBeCloseTo(1.5, 3);
    expect(cba.yCenter).toBeCloseTo(3, 3);
  });

  describe('constructor', () => {
    it('stores circle', () => {
      let svg = createNodeSVG();
      let c = svg.circle(30);
      c.id();
      let cba = new CircleBaseAnnotation(c, 2, 8);
      expect(cba._circle.id()).toBe(c.id());
    });

    it('validates circle', () => {
      let svg = createNodeSVG();
      let c = svg.circle(15);
      expect(c.attr('id')).toBe(undefined);
      let cba = new CircleBaseAnnotation(c, 1, 1);
      expect(c.attr('id')).not.toBe(undefined);
    });

    it('stores displacement', () => {
      let svg = createNodeSVG();
      let c = svg.circle(40);
      c.id();
      c.attr({ 'cx': 5, 'cy': 12 });
      let cba = new CircleBaseAnnotation(c, 3, 20);
      expect(cba.displacementLength).toBeCloseTo(distanceBetween(5, 12, 3, 20), 3);
      expect(
        normalizeAngle(cba.displacementAngle)
      ).toBeCloseTo(normalizeAngle(angleBetween(3, 20, 5, 12)));
    });
  });
  
  describe('_validateCircle method', () => {
    it('initializes ID if not already initialized', () => {
      let svg = createNodeSVG();
      let c = svg.circle(10);
      expect(c.attr('id')).toBe(undefined);
      let cba = new CircleBaseAnnotation(c, 0, 0);
      expect(c.attr('id')).not.toBe(undefined);
    });
  });

  it('type getter', () => {
    let svg = createNodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    expect(cba.type).toBe('circle');
  })

  it('id getter', () => {
    let svg = createNodeSVG();
    let c = svg.circle(8);
    c.id();
    let cba = new CircleBaseAnnotation(c, 0, 0);
    expect(cba.id).toBe(c.id());
  });

  it('xCenter and yCenter getters', () => {
    let svg = createNodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 3, 4);
    expect(cba.xCenter).toBeCloseTo(3, 3);
    expect(cba.yCenter).toBeCloseTo(4, 3);
  });

  it('displacementLength and displacementAngle getters', () => {
    let svg = createNodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 5, 8);
    cba.shift(1, 9, 5, 8);
    expect(cba.displacementLength).toBe(cba._displacementLength);
    expect(cba.displacementAngle).toBe(cba._displacementAngle);
  });

  describe('shift method', () => {
    it('shifts the circle', () => {
      let svg = createNodeSVG();
      let cba = CircleBaseAnnotation.createNondisplaced(svg, 5, 9);
      cba.shift(4, 3, 5, 9);
      expect(cba.xCenter).toBeCloseTo(9, 3);
      expect(cba.yCenter).toBeCloseTo(12, 3);
    });

    it('updates displacement', () => {
      let svg = createNodeSVG();
      let cba = CircleBaseAnnotation.createNondisplaced(svg, -2, 19);
      cba.shift(5, 8, -2, 19);
      expect(cba.displacementLength).toBeCloseTo(distanceBetween(3, 27, -2, 19), 3);
      expect(cba.displacementAngle).toBeCloseTo(
        normalizeAngle(angleBetween(-2, 19, 3, 27))
      );
    });
  });

  describe('reposition method', () => {
    it('maintains displacement', () => {
      let svg = createNodeSVG();
      let cba = CircleBaseAnnotation.createNondisplaced(svg, 3, 9);
      cba.shift(-1, 8, 3, 9);
      let dl = cba.displacementLength;
      let da = cba.displacementAngle;
      cba.reposition(5, 14);
      expect(cba.displacementLength).toBeCloseTo(dl, 3);
      expect(cba.displacementAngle).toBeCloseTo(da, 3);
      expect(cba.xCenter).toBeCloseTo(5 + (dl * Math.cos(da)));
      expect(cba.yCenter).toBeCloseTo(14 + (dl * Math.sin(da)));
    });
  });

  it('insertBefore and insertAfter methods', () => {
    let svg = createNodeSVG();
    let r = svg.rect(1, 5);
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    expect(cba._circle.position()).toBeGreaterThan(r.position());
    cba.insertBefore(r);
    expect(cba._circle.position()).toBeLessThan(r.position());
    cba.insertAfter(r);
    expect(cba._circle.position()).toBeGreaterThan(r.position());
  });

  it('radius getter and setter', () => {
    let svg = createNodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    cba.radius = 8;
    expect(cba.radius).toBeCloseTo(8, 3);
  });

  it('fill getter and setter', () => {
    let svg = createNodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    cba.fill = '#654321';
    expect(cba.fill).toBe('#654321');
  });

  it('fillOpacity getter and setter', () => {
    let svg = createNodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    cba.fillOpacity = 0.6;
    expect(cba.fillOpacity).toBeCloseTo(0.6, 6);
  });

  it('stroke getter and setter', () => {
    let svg = createNodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    cba.stroke = '#abcdef';
    expect(cba.stroke).toBe('#abcdef');
  });

  it('strokeWidth getter and setter', () => {
    let svg = createNodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    cba.strokeWidth = 5;
    expect(cba.strokeWidth).toBeCloseTo(5, 6);
  });

  it('strokeOpacity getter and setter', () => {
    let svg = createNodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    cba.strokeOpacity = 0.3;
    expect(cba.strokeOpacity).toBeCloseTo(0.3, 6);
  });

  it('remove method', () => {
    let svg = createNodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    let id = cba._circle.id();
    expect(svg.findOne('#' + id)).not.toBe(null);
    cba.remove();
    expect(svg.findOne('#' + id)).toBe(null);
  });

  it('savableState method', () => {
    let svg = createNodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    let savableState = cba.savableState();
    expect(savableState.className).toBe('CircleBaseAnnotation');
    expect(savableState.circle).toBe(cba._circle.id());
  });
});
