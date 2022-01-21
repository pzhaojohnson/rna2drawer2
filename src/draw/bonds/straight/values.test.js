import { values, setValues } from './values';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { SVGLineWrapper as LineWrapper } from 'Draw/svg/SVGLineWrapper';
import { Base } from 'Draw/bases/Base';
import { StraightBond } from './StraightBond';
import { round } from 'Math/round';

function roundBasePaddings(vs, places=3) {
  vs.basePadding1 = round(vs.basePadding1, places);
  vs.basePadding2 = round(vs.basePadding2, places);
}

let container = null;
let svg = null;
let bond = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  let line = new LineWrapper(svg.line(50, 20, 100, 20));
  let base1 = Base.create(svg, 'T', 25, 20);
  let base2 = Base.create(svg, 'A', 150, 20);
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

describe('values function', () => {
  it('returns values', () => {
    // make all values different to test if they are mixed up
    bond.line.attr({
      'stroke': '#665a1f',
      'stroke-width': 8.57,
      'stroke-opacity': 0.62,
    });
    bond.basePadding1 = 18.3;
    bond.basePadding2 = 9.7;
    let vs = values(bond);
    roundBasePaddings(vs);
    expect(vs).toEqual({
      line: {
        'stroke': '#665a1f',
        'stroke-width': 8.57,
        'stroke-opacity': 0.62,
      },
      basePadding1: 18.3,
      basePadding2: 9.7,
    });
  });
});

describe('setValues function', () => {
  it('sets provided values', () => {
    // make all values different to test if they are mixed up
    let vs1 = {
      line: {
        'stroke': '#ab90f0',
        'stroke-width': 12.02,
        'stroke-opacity': 0.24,
      },
      basePadding1: 9.8,
      basePadding2: 12.1,
    };
    setValues(bond, vs1);
    let vs2 = values(bond);
    roundBasePaddings(vs2);
    expect(vs2).toEqual(vs1);
  });

  it("doesn't set values to undefined", () => {
    let vs1 = {
      line: {
        'stroke': '#66a210',
        'stroke-width': 9.3,
        'stroke-opacity': 0.28,
      },
      basePadding1: 12.6,
      basePadding2: 3.2,
    };
    setValues(bond, vs1);
    // with a defined line values object
    setValues(bond, { line: {} });
    // with an undefined line values object
    setValues(bond, {});
    let vs2 = values(bond);
    roundBasePaddings(vs2);
    expect(vs2).toEqual(vs1);
  });
});
