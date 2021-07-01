import { position } from './position';
import { NodeSVG } from 'Draw/NodeSVG';
import Base from 'Draw/Base';
import { StraightBond } from './StraightBond';

let container = null;
let svg = null;
let bond = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  let line = svg.line(20, 30, 40, 50);
  let base1 = Base.create(svg, 'A', 100, 200);
  let base2 = Base.create(svg, 'H', 50, 500);
  bond = new StraightBond(line, base1, base2);
});

afterEach(() => {
  bond = null;

  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('position function', () => {
  it('positions line', () => {
    bond.base1.moveTo(783, 1238);
    bond.base2.moveTo(15.5, 209);
    position(bond, {
      basePadding1: 32.8,
      basePadding2: 18.2,
    });
    expect(bond.line.attr('x1')).toBeCloseTo(763.3895);
    expect(bond.line.attr('y1')).toBeCloseTo(1211.7079);
    expect(bond.line.attr('x2')).toBeCloseTo(26.3813);
    expect(bond.line.attr('y2')).toBeCloseTo(223.5888);
  });

  it('updates opacity', () => {
    bond.base1.moveTo(50, 250);
    bond.base2.moveTo(300, 600);
    position(bond, {
      basePadding1: 20,
      basePadding2: 10,
    });
    expect(bond.line.attr('opacity')).toBe(1); // starts at 1
    bond.base1.moveTo(75, 85);
    bond.base2.moveTo(80, 100);
    position(bond, {
      basePadding1: 15,
      basePadding2: 20,
    });
    // since the base padding exceeds the distance between the bases
    expect(bond.line.attr('opacity')).toBe(0);
    bond.base2.moveTo(800, 1000);
    position(bond, {
      basePadding1: 3,
      basePadding2: 8,
    });
    // since the base padding no longer exceeds the distance
    // between the bases
    expect(bond.line.attr('opacity')).toBe(1);
  });

  it('smoke test', () => {
    for (let i = 0; i < 200; i++) {
      let baseCenter1 = {
        x: (1000 * Math.random()) - 500, // include negative coordinates
        y: (1000 * Math.random()) - 500,
      };
      let baseCenter2 = {
        x: (1000 * Math.random()) - 500,
        y: (1000 * Math.random()) - 500,
      };
      let basePadding1 = 200 * Math.random();
      let basePadding2 = 200 * Math.random();
      bond.base1.moveTo(baseCenter1.x, baseCenter1.y);
      bond.base2.moveTo(baseCenter2.x, baseCenter2.y);
      expect(() => {
        position(bond, {
          basePadding1: basePadding1,
          basePadding2: basePadding2,
        });
      }).not.toThrow();
      ['x1', 'y1', 'x2', 'y2', 'opacity'].forEach(attr => {
        let v = bond.line.attr(attr);
        expect(typeof v).toBe('number');
        expect(Number.isFinite(v)).toBeTruthy();
      });
    }
  });
});
