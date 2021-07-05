import { SecondaryBond } from './SecondaryBond';
import { NodeSVG } from 'Draw/NodeSVG';
import { SVGLineWrapper as LineWrapper } from 'Draw/svg/line';
import Base from 'Draw/Base';

let svg = NodeSVG();

describe('SecondaryBond class', () => {
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
          let line = new LineWrapper(svg.line(100, 200, 300, 200));
          let base1 = Base.create(svg, c1, 50, 200);
          let base2 = Base.create(svg, c2, 350, 200);
          let bond = new SecondaryBond(line, base1, base2);
          expect(bond.type).toBe(t12.type);
        });
      });
    });
  });
});
