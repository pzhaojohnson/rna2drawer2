import { savableState } from './save';
import { NodeSVG } from 'Draw/NodeSVG';
import { SVGLineWrapper as LineWrapper } from 'Draw/svg/line';
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

  let line = new LineWrapper(svg.line(100, 500, 550, 500));
  let base1 = Base.create(svg, 'A', 50, 500);
  let base2 = Base.create(svg, 'T', 600, 500);
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

describe('savableState function', () => {
  it('returns savable states', () => {
    let lineId = bond.line.id();
    let baseId1 = bond.base1.id;
    let baseId2 = bond.base2.id;
    expect(lineId).toBeTruthy();
    expect(baseId1).toBeTruthy();
    expect(baseId2).toBeTruthy();
    let saved = savableState(bond);
    expect(saved).toEqual({
      className: 'StraightBond',
      lineId: lineId,
      baseId1: baseId1,
      baseId2: baseId2,
    });
  });

  it('returns savable states that can be converted to and from JSON', () => {
    let saved1 = savableState(bond);
    let string1 = JSON.stringify(saved1);
    let saved2 = JSON.parse(string1);
    expect(saved2).toEqual(saved1);
  });
});
