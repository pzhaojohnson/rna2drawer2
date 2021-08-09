import { position } from './position';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { SVGPathWrapper as PathWrapper } from 'Draw/svg/path';
import { Base } from 'Draw/bases/Base';
import { QuadraticBezierBond } from './QuadraticBezierBond';

let container = null;
let svg = null;
let bond = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  let path = new PathWrapper(svg.path('M 20 30 Q 50 40 10 200'));
  let base1 = Base.create(svg, 'A', 20, 30);
  let base2 = Base.create(svg, 'U', 50, 60);
  bond = new QuadraticBezierBond(path, base1, base2);
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
  it('positions bond', () => {
    bond.base1.recenter({ x: 101, y: 203.5 });
    bond.base2.recenter({ x: 802.9, y: 935 });
    position(bond, {
      basePadding1: 12.8,
      basePadding2: 19.7,
      controlPointDisplacement: {
        magnitude: 82.4,
        angle: 3.87,
      },
    });
    let pa = bond.path.wrapped.array();
    expect(pa.length).toBe(2);
    let m = pa[0];
    expect(m[0]).toBe('M');
    expect(m[1]).toBeCloseTo(110.924617);
    expect(m[2]).toBeCloseTo(211.583438);
    expect(m.length).toBe(3);
    let q = pa[1];
    expect(q[0]).toBe('Q');
    expect(q[1]).toBeCloseTo(448.955950);
    expect(q[2]).toBeCloseTo(486.904413);
    expect(q[3]).toBeCloseTo(790.689089);
    expect(q[4]).toBeCloseTo(919.540903);
    expect(q.length).toBe(5);
  });

  it('smoke test', () => {
    for (let i = 0; i < 50; i++) {
      bond.base1.recenter({
        x: (1000 * Math.random()) - 500, // include negatives
        y: (1000 * Math.random()) - 500,
      });
      bond.base2.recenter({
        x: (1000 * Math.random()) - 500,
        y: (1000 * Math.random()) - 500,
      });
      expect(() => {
        position(bond, {
          basePadding1: 200 * Math.random(),
          basePadding2: 200 * Math.random(),
          controlPointDisplacement: {
            magnitude: 300 * Math.random(),
            angle: (20 * Math.random()) - 10, // include negatives
          },
        });
      }).not.toThrow();
    }
  });
});
