import { savableState } from './save';
import { NodeSVG } from 'Draw/NodeSVG';
import Base from 'Draw/Base';
import { QuadraticBezierBond } from './QuadraticBezierBond';

let container = null;
let svg = null;
let bond = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  let path = svg.path('M 10 20 Q 30 40 50 60');
  let base1 = Base.create(svg, 'G', 10, 30);
  let base2 = Base.create(svg, 'C', 30, 300);
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

describe('savableState function', () => {
  it('returns savable states with correct values', () => {
    let saved = savableState(bond);
    expect(saved).toEqual({
      className: 'QuadraticBezierBond',
      pathId: bond.path.id(),
      baseId1: bond.base1.id,
      baseId2: bond.base2.id,
    });
    // check that all IDs are defined
    expect(saved.pathId).toBeTruthy();
    expect(saved.baseId1).toBeTruthy();
    expect(saved.baseId2).toBeTruthy();
  });

  it('returns savable states that can be converted to and from JSON', () => {
    let saved1 = savableState(bond);
    let string1 = JSON.stringify(saved1);
    let saved2 = JSON.parse(string1);
    expect(saved2).toEqual(saved1);
  });
});
