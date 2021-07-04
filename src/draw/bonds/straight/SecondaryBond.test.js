import { SecondaryBond } from './SecondaryBond';
import { NodeSVG } from 'Draw/NodeSVG';
import Base from 'Draw/Base';

let svg = NodeSVG();

describe('SecondaryBond class', () => {
  describe('fromSavedState static method', () => {
    describe('invalid saved state', () => {
      it('wrong class name', () => {
        let line = svg.line(2, 3, 28, 38);
        let b1 = Base.create(svg, 'a', 1, 2);
        let b2 = Base.create(svg, 'w', 30, 40);
        let getBaseById = id => id === b1.id ? b1 : b2;
        let sb = new SecondaryBond(line, b1, b2);
        let savableState = sb.savableState();
        savableState.className = 'StraghtBond';
        expect(
          () => SecondaryBond.fromSavedState(savableState, svg, getBaseById)
        ).toThrow();
      });
    });

    it('valid saved state', () => {
      let line = svg.line(95, 210, 55, 790);
      let b1 = Base.create(svg, 'M', 100, 200);
      let b2 = Base.create(svg, 'q', 50, 800);
      let getBaseById = id => id === b1.id ? b1 : b2;
      let sb1 = new SecondaryBond(line, b1, b2);
      let lineId = sb1.line.id();
      let savableState = sb1.savableState();
      let sb2 = SecondaryBond.fromSavedState(savableState, svg, getBaseById);
      expect(sb2.line.id()).toBe(lineId);
      expect(sb2.base1).toBe(b1);
      expect(sb2.base2).toBe(b2);
    });
  });

  it('type getter', () => {
    [
      { type: 'AUT',
        characters1: ['A', 'a'],
        characters2: ['U', 'u', 'T', 't'] },
      { type: 'AUT',
        characters1: ['U', 'u', 'T', 't'],
        characters2: ['A', 'a'] },
      { type: 'GC',
        characters1: ['G', 'g'],
        characters2: ['C', 'c'] },
      { type: 'GC',
        characters1: ['C', 'c'],
        characters2: ['G', 'g'] },
      { type: 'GUT',
        characters1: ['G', 'g'],
        characters2: ['U', 'u', 'T', 't'] },
      { type: 'GUT',
        characters1: ['U', 'u', 'T', 't'],
        characters2: ['G', 'g'] },
      // characters 1 are other characters
      { type: 'other', characters1: ['X', 'x'], characters2: ['G', 'g'] },
      // characters 2 are other characters
      { type: 'other', characters1: ['A', 'a'], characters2: ['N', 'n'] },
      // both characters 1 and 2 are other characters
      { type: 'other', characters1: ['M', 'm'], characters2: ['W', 'w'] },
    ].forEach(t12 => {
      t12.characters1.forEach(c1 => {
        t12.characters2.forEach(c2 => {
          let line = svg.line(100, 200, 300, 200);
          let base1 = Base.create(svg, c1, 50, 200);
          let base2 = Base.create(svg, c2, 350, 200);
          let bond = new SecondaryBond(line, base1, base2);
          expect(bond.type).toBe(t12.type);
        });
      });
    });
  });
});
