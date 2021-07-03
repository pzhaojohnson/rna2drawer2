import { PrimaryBond } from './PrimaryBond';
import { StraightBond } from './StraightBond';
import NodeSVG from 'Draw/NodeSVG';
import Base from 'Draw/Base';
import angleBetween from 'Draw/angleBetween';
import normalizeAngle from 'Draw/normalizeAngle';

let svg = NodeSVG();

describe('PrimaryBond class', () => {
  describe('fromSavedState static method', () => {
    let b1 = Base.create(svg, 'q', 5, 8);
    let b2 = Base.create(svg, 't', 100, 200);
    let getBaseById = id => id === b1.id ? b1 : b2;

    describe('invalid saved state', () => {
      it('wrong class name', () => {
        let pb = PrimaryBond.create(svg, b1, b2);
        let savableState = pb.savableState();
        savableState.className = 'StraightBnd';
        expect(
          () => StraightBond.fromSavedState(savableState, svg, getBaseById)
        ).toThrow();
      });
    });

    it('valid saved state', () => {
      let pb1 = PrimaryBond.create(svg, b1, b2);
      let lineId = pb1.line.id();
      let savableState = pb1.savableState();
      let pb2 = PrimaryBond.fromSavedState(savableState, svg, getBaseById);
      expect(pb2.line.id()).toBe(lineId);
      expect(pb2.base1).toBe(b1);
      expect(pb2.base2).toBe(b2);
    });
  });

  describe('create static method', () => {
    let b1 = Base.create(svg, 'b', 1, 5);
    let b2 = Base.create(svg, 'Y', 10, 20);
    let pb = PrimaryBond.create(svg, b1, b2);

    it('creates with bases', () => {
      expect(pb.base1).toBe(b1);
      expect(pb.base2).toBe(b2);
    });

    it('creates with valid line coordinates', () => {
      let baseAngle = b1.angleBetweenCenters(b2);
      let lineAngle = angleBetween(
        pb.line.attr('x1'), pb.line.attr('y1'),
        pb.line.attr('x2'), pb.line.attr('y2'),
      );
      expect(normalizeAngle(lineAngle)).toBeCloseTo(normalizeAngle(baseAngle));
    });

    it('sets opacity', () => {
      let b1 = Base.create(svg, 'a', 5, 50);
      let b2 = Base.create(svg, 'g', 5, 50);
      let b3 = Base.create(svg, 'f', 1000, 2000);
      // zero distance between bases
      let pb1 = PrimaryBond.create(svg, b1, b2);
      expect(pb1.opacity).toBe(0);
      // far away bases
      let pb2 = PrimaryBond.create(svg, b1, b3);
      expect(pb2.opacity).toBe(1);
    });
  });
});
