import { shiftControlPoint } from './drag';
import { NodeSVG } from 'Draw/NodeSVG';
import { SVGPathWrapper as PathWrapper } from 'Draw/svg/path';
import Base from 'Draw/Base';
import { QuadraticBezierBond } from './QuadraticBezierBond';
import { TertiaryBond } from './TertiaryBond';
import { setValues } from './values';

let container = null;
let svg = null;
let bond = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  let path = new PathWrapper(svg.path('M 10 20 Q 44 55 66 77'));
  let base1 = Base.create(svg, 'A', 20, 30);
  let base2 = Base.create(svg, 'B', 200, 100);
  bond = new QuadraticBezierBond(path, base1, base2);
  setValues(bond, TertiaryBond.recommendedDefaults);
});

afterEach(() => {
  bond = null;

  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('shiftControlPoint function', () => {
  it('updates path and displacement', () => {
    bond.base1.moveTo(33, 67);
    bond.base2.moveTo(1120, 821);
    bond.basePadding1 = 23.6;
    bond.basePadding2 = 9.4;
    bond.setControlPointDisplacement({
      magnitude: 33.2,
      angle: 0.9,
    });
    
    shiftControlPoint(bond, { x: 44.5, y: -62 });
    
    // updated path
    let pa = bond.path.wrapped.array();
    expect(pa.length).toBe(2);
    let m = pa[0];
    expect(m[0]).toBe('M');
    expect(m[1]).toBeCloseTo(53.326680);
    expect(m[2]).toBeCloseTo(78.991081);
    expect(m.length).toBe(3);
    let q = pa[1];
    expect(q[1]).toBeCloseTo(623.134724);
    expect(q[2]).toBeCloseTo(415.131298);
    expect(q[3]).toBeCloseTo(1112.720082);
    expect(q[4]).toBeCloseTo(815.053336);
    expect(q.length).toBe(5);

    // updated displacement
    expect(bond.controlPointDisplacement().magnitude).toBeCloseTo(54.847054);
    expect(bond.controlPointDisplacement().angle).toBeCloseTo(5.122431);

    // should be able to reposition the bond
    // and maintain the new displacement
    bond.base1.moveTo(6000, 3000);
    bond.base2.moveTo(-200, 12);
    bond.reposition();
    expect(bond.controlPointDisplacement().magnitude).toBeCloseTo(54.847054);
    expect(bond.controlPointDisplacement().angle).toBeCloseTo(5.122431);
  });
});
