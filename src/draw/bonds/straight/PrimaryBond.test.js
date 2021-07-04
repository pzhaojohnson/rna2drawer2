import { PrimaryBond } from './PrimaryBond';
import { StraightBond } from './StraightBond';
import NodeSVG from 'Draw/NodeSVG';
import Base from 'Draw/Base';

let svg = NodeSVG();

describe('PrimaryBond class', () => {
  describe('fromSavedState static method', () => {
    let line = svg.line(10, 16, 90, 190);
    let b1 = Base.create(svg, 'q', 5, 8);
    let b2 = Base.create(svg, 't', 100, 200);
    let getBaseById = id => id === b1.id ? b1 : b2;

    describe('invalid saved state', () => {
      it('wrong class name', () => {
        let pb = new PrimaryBond(line, b1, b2);
        let savableState = pb.savableState();
        savableState.className = 'StraightBnd';
        expect(
          () => StraightBond.fromSavedState(savableState, svg, getBaseById)
        ).toThrow();
      });
    });

    it('valid saved state', () => {
      let pb1 = new PrimaryBond(line, b1, b2);
      let lineId = pb1.line.id();
      let savableState = pb1.savableState();
      let pb2 = PrimaryBond.fromSavedState(savableState, svg, getBaseById);
      expect(pb2.line.id()).toBe(lineId);
      expect(pb2.base1).toBe(b1);
      expect(pb2.base2).toBe(b2);
    });
  });
});
