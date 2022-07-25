import { positioning } from './positioning';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { Base } from 'Draw/bases/Base';
import { QuadraticBezierBond } from './QuadraticBezierBond';
import { normalizeAngle } from 'Math/angles/normalizeAngle';
import { round } from 'Math/round';

function roundPositioning(p, places=3) {
  p.basePadding1 = round(p.basePadding1, places);
  p.basePadding2 = round(p.basePadding2, places);
  p.controlPointDisplacement = {
    magnitude: round(p.controlPointDisplacement.magnitude, places),
    angle: round(p.controlPointDisplacement.angle, places),
  };
}

let container = null;
let svg = null;
let bond = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  let path = svg.path('M 20 30 Q 40 50 60 70');
  let base1 = Base.create(svg, 'Q', 10, 20);
  let base2 = Base.create(svg, 'W', 100, 200);
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

describe('positioning function', () => {
  it('retrieves positioning', () => {
    bond.base1.recenter({ x: 52, y: 156 });
    bond.base2.recenter({ x: 78, y: 212 });
    bond.path.plot('M 60.469585 155.281582 Q 120.513767 150.188438 86.047063 200.300223');
    let p = positioning(bond);
    p.controlPointDisplacement.angle = normalizeAngle(p.controlPointDisplacement.angle);
    roundPositioning(p);
    expect(p).toEqual({
      basePadding1: 8.5,
      basePadding2: 14.2,
      controlPointDisplacement: {
        magnitude: 65,
        angle: 4.6,
      },
    });
  });
});
