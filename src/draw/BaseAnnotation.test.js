import { CircleBaseAnnotation } from './BaseAnnotation';
import NodeSVG from './NodeSVG';
import distanceBetween from './distanceBetween';
import normalizeAngle from './normalizeAngle';
import angleBetween from './angleBetween';

let svg = NodeSVG();

describe('CircleBaseAnnotation class', () => {
  describe('fromSavedState static method', () => {
    it('valid saved state', () => {
      let cba1 = CircleBaseAnnotation.createNondisplaced(svg, 1, 10);
      let savableState = cba1.savableState();
      let cba2 = CircleBaseAnnotation.fromSavedState(savableState, svg, 1, 10);
      expect(cba2._circle.id()).toBe(savableState.circleId);
    });

    describe('invalid cases', () => {
      it('wrong className', () => {
        let cba = CircleBaseAnnotation.createNondisplaced(svg, 0, 4);
        let savableState = cba.savableState();
        savableState.className = 'CircleBseAnnotation';
        expect(
          () => CircleBaseAnnotation.fromSavedState(savableState, svg, 0, 4)
        ).toThrow();
      });

      it('circle does not exist', () => {
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
    let svg = NodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1.5, 3);
    expect(cba.xCenter).toBeCloseTo(1.5, 3);
    expect(cba.yCenter).toBeCloseTo(3, 3);
  });

  describe('constructor', () => {
    it('stores circle', () => {
      let svg = NodeSVG();
      let c = svg.circle(30);
      c.id();
      let cba = new CircleBaseAnnotation(c, 2, 8);
      expect(cba._circle.id()).toBe(c.id());
    });

    it('validates circle', () => {
      let svg = NodeSVG();
      let c = svg.circle(15);
      expect(c.attr('id')).toBe(undefined);
      let cba = new CircleBaseAnnotation(c, 1, 1);
      expect(c.attr('id')).not.toBe(undefined);
    });

    it('stores displacement', () => {
      let svg = NodeSVG();
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
      let svg = NodeSVG();
      let c = svg.circle(10);
      expect(c.attr('id')).toBe(undefined);
      let cba = new CircleBaseAnnotation(c, 0, 0);
      expect(c.attr('id')).not.toBe(undefined);
    });
  });

  it('type getter', () => {
    let svg = NodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    expect(cba.type).toBe('circle');
  })

  it('id getter', () => {
    let svg = NodeSVG();
    let c = svg.circle(8);
    c.id();
    let cba = new CircleBaseAnnotation(c, 0, 0);
    expect(cba.id).toBe(c.id());
  });

  it('xCenter and yCenter getters', () => {
    let svg = NodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 3, 4);
    expect(cba.xCenter).toBeCloseTo(3, 3);
    expect(cba.yCenter).toBeCloseTo(4, 3);
  });

  it('displacementLength and displacementAngle getters', () => {
    let svg = NodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 5, 8);
    cba.shift(1, 9);
    expect(cba.displacementLength).toBe(cba._displacementLength);
    expect(cba.displacementAngle).toBe(cba._displacementAngle);
  });

  describe('shift method', () => {
    it('shifts the circle', () => {
      let svg = NodeSVG();
      let cba = CircleBaseAnnotation.createNondisplaced(svg, 5, 9);
      cba.shift(4, 3);
      expect(cba.xCenter).toBeCloseTo(9, 3);
      expect(cba.yCenter).toBeCloseTo(12, 3);
    });

    it('updates displacement', () => {
      let svg = NodeSVG();
      let cba = CircleBaseAnnotation.createNondisplaced(svg, -2, 19);
      cba.shift(5, 8);
      expect(cba.displacementLength).toBeCloseTo(distanceBetween(3, 27, -2, 19), 3);
      expect(cba.displacementAngle).toBeCloseTo(
        normalizeAngle(angleBetween(-2, 19, 3, 27))
      );
    });
  });

  describe('reposition method', () => {
    it('maintains displacement', () => {
      let svg = NodeSVG();
      let cba = CircleBaseAnnotation.createNondisplaced(svg, 3, 9);
      cba.shift(-1, 8);
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
    let svg = NodeSVG();
    let r = svg.rect(1, 5);
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    expect(cba._circle.position()).toBeGreaterThan(r.position());
    cba.insertBefore(r);
    expect(cba._circle.position()).toBeLessThan(r.position());
    cba.insertAfter(r);
    expect(cba._circle.position()).toBeGreaterThan(r.position());
  });

  it('radius getter and setter', () => {
    let svg = NodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    cba.radius = 8;
    expect(cba.radius).toBeCloseTo(8, 3);
  });

  it('fill getter and setter', () => {
    let svg = NodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    cba.fill = '#654321';
    expect(cba.fill).toBe('#654321');
  });

  it('fillOpacity getter and setter', () => {
    let svg = NodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    cba.fillOpacity = 0.6;
    expect(cba.fillOpacity).toBeCloseTo(0.6, 6);
  });

  it('stroke getter and setter', () => {
    let svg = NodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    cba.stroke = '#abcdef';
    expect(cba.stroke).toBe('#abcdef');
  });

  it('strokeWidth getter and setter', () => {
    let svg = NodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    cba.strokeWidth = 5;
    expect(cba.strokeWidth).toBeCloseTo(5, 6);
  });

  it('strokeOpacity getter and setter', () => {
    let svg = NodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    cba.strokeOpacity = 0.3;
    expect(cba.strokeOpacity).toBeCloseTo(0.3, 6);
  });

  it('remove method', () => {
    let svg = NodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
    let id = cba._circle.id();
    expect(svg.findOne('#' + id)).not.toBe(null);
    cba.remove();
    expect(svg.findOne('#' + id)).toBe(null);
  });

  describe('savableState method', () => {
    it('includes className and circle ID', () => {
      let svg = NodeSVG();
      let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
      let savableState = cba.savableState();
      expect(savableState.className).toBe('CircleBaseAnnotation');
      expect(savableState.circleId).toBe(cba._circle.id());
    });

    it('can be converted to and from a JSON string', () => {
      let svg = NodeSVG();
      let cba1 = CircleBaseAnnotation.createNondisplaced(svg, 5, 9);
      let savableState1 = cba1.savableState();
      let json1 = JSON.stringify(savableState1);
      let savableState2 = JSON.parse(json1);
      let json2 = JSON.stringify(savableState2);
      expect(json2).toBe(json1);
    });
  });

  it('refreshIds method', () => {
    let svg = NodeSVG();
    let cba = CircleBaseAnnotation.createNondisplaced(svg, 10, 50);
    let oldId = cba._circle.id();
    cba.refreshIds();
    expect(cba._circle.id()).not.toBe(oldId);
  });
});
