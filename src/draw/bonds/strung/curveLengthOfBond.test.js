import { NodeSVG } from 'Draw/svg/NodeSVG';

import { Base } from 'Draw/bases/Base';

import { StraightBond } from 'Draw/bonds/straight/StraightBond';
import { QuadraticBezierBond } from 'Draw/bonds/curved/QuadraticBezierBond';

import { curveLengthOfBond } from './curveLengthOfBond';

let container = null;
let svg = null;

let base1 = null;
let base2 = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  let text1 = svg.text('A');
  base1 = new Base({ text: text1 });

  let text2 = svg.text('U');
  base2 = new Base({ text: text2 });
});

afterEach(() => {
  base1 = null;
  base2 = null;

  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('curveLengthOfBond function', () => {
  test('a straight bond', () => {
    let line = svg.line(1, 2, 3, 4);
    let bond = new StraightBond(line, base1, base2);
    base1.recenter({ x: 1854.4737575054169, y: 1252.006718158722 });
    base2.recenter({ x: 1879.4063746929169, y: 1268.145634174347 });
    bond.basePadding1 = 6;
    bond.basePadding2 = 6;
    bond.reposition();

    let curveLength = curveLengthOfBond(bond);
    expect(curveLength).toBeCloseTo(17.699953079223633);

    // test a non-numeric line coordinate
    bond.line.attr('x2', 'asdf');
    curveLength = curveLengthOfBond(bond);
    // non-numeric values seem to be interpreted as zero
    expect(curveLength).toBeCloseTo(1859.5354957744978);
  });

  test('a quadratic bezier bond', () => {
    let path = svg.path('M 1 2 Q 3 4 5 6');
    let bond = new QuadraticBezierBond(path, base1, base2);
    base1.recenter({ x: 1754.8646261692047, y: 1563.66064786911 });
    base2.recenter({ x: 1795.9012472629547, y: 1394.3153109550476 });
    bond.basePadding1 = 8;
    bond.basePadding2 = 8;
    bond.setControlPointDisplacement({
      magnitude: 60.98627966315738,
      angle: 3 * Math.PI / 2,
    });
    bond.reposition();

    let curveLength = curveLengthOfBond(bond);
    expect(curveLength).toBeCloseTo(173.45832238415053);
  });
});
