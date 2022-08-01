import { NodeSVG } from 'Draw/svg/NodeSVG';

import { Base } from 'Draw/bases/Base';

import { StraightBond } from 'Draw/bonds/straight/StraightBond';
import { QuadraticBezierBond } from 'Draw/bonds/curved/QuadraticBezierBond';

import { round } from 'Math/round';

import { curveOfBond } from './curveOfBond';

function roundCoordinatesOfPoint(point, places=3) {
  point.x = round(point.x, places);
  point.y = round(point.y, places);
}

function roundCoordinatesOfCurve(curve, places=3) {
  roundCoordinatesOfPoint(curve.startPoint, places);
  roundCoordinatesOfPoint(curve.endPoint, places);

  if (curve.controlPoint) {
    roundCoordinatesOfPoint(curve.controlPoint, places);
  }
}

let container = null;
let svg = null;

let base1 = null;
let base2 = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  let text1 = svg.text('G');
  base1 = new Base({ text: text1 });

  let text2 = svg.text('C');
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

describe('curveOfBond function', () => {
  test('a straight bond', () => {
    let line = svg.line(1, 2, 3, 4);
    let bond = new StraightBond(line, base1, base2);
    base1.recenter({ x: 1636.387380361557, y: 1140.8053259849548 });
    base2.recenter({ x: 1665.4599630832672, y: 1146.8785681724548 });
    bond.basePadding1 = 6;
    bond.basePadding2 = 6;
    bond.reposition();

    let curve = curveOfBond(bond);
    roundCoordinatesOfCurve(curve, 3);
    expect(curve).toStrictEqual({
      startPoint: { x: 1642.261, y: 1142.032 },
      endPoint: { x: 1659.587, y: 1145.652 },
    });

    // test a non-numeric line coordinate
    bond.line.attr('y1', 'qwer');
    curve = curveOfBond(bond);
    roundCoordinatesOfCurve(curve, 3);
    // non-numeric values seem to be interpreted as zero
    expect(curve).toStrictEqual({
      startPoint: { x: 1642.261, y: 0 },
      endPoint: { x: 1659.587, y: 1145.652 },
    });
  });

  test('a quadratic bezier bond', () => {
    let path = svg.path('M 1 2 Q 3 4 5 6');
    let bond = new QuadraticBezierBond(path, base1, base2);
    base1.recenter({ x: 1768.2465844154358, y: 1565.3498816490173 });
    base2.recenter({ x: 1809.0477316379547, y: 1397.3109412193298 });
    bond.basePadding1 = 8;
    bond.basePadding2 = 8;
    bond.setControlPointDisplacement({
      magnitude: 60.52249864006939,
      angle: 3 * Math.PI / 2,
    });
    bond.reposition();

    let curve = curveOfBond(bond);
    roundCoordinatesOfCurve(curve, 3);
    expect(curve).toStrictEqual({
      startPoint: { x: 1765.335, y: 1557.899 },
      controlPoint: { x: 1729.834, y: 1467.050 },
      endPoint: { x: 1803.043, y: 1402.597 },
    });

    // test a non-numeric path coordinate
    bond.path.plot('M 1765.335 1557.899 Q 1729.834 k 1803.043 1402.597');
    // the invalid "Q" path command seems to get ignored
    expect(bond.path.array()).toEqual([['M', 1765.335, 1557.899]]);
    curve = curveOfBond(bond);
    expect(curve).toBeUndefined();

    // test a relative "q" path command
    bond.path.plot('M 1765.335 1557.899 q 1729.834 1467.050 1803.043 1402.597');
    curve = curveOfBond(bond);
    roundCoordinatesOfCurve(curve, 3);
    // relative "q" path commands seem to get converted to absolute "Q" commands
    expect(curve).toStrictEqual({
      startPoint: { x: 1765.335, y: 1557.899 },
      controlPoint: { x: 3495.169, y: 3024.949 },
      endPoint: { x: 3568.378, y: 2960.496 },
    });

    // test a wrong path command
    bond.path.plot('M 1765.335 1557.899 L 1729.834 1467.050');
    curve = curveOfBond(bond);
    expect(curve).toBeUndefined();

    // test missing path commands
    bond.path.plot('M 1765.335 1557.899');
    curve = curveOfBond(bond);
    expect(curve).toBeUndefined();
    bond.path.plot('');
    curve = curveOfBond(bond);
    expect(curve).toBeUndefined();
  });
});
