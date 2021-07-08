import { values, setValues } from './values';
import { NodeSVG } from 'Draw/NodeSVG';
import Base from 'Draw/Base';
import { QuadraticBezierBond } from './QuadraticBezierBond';
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

  let path = svg.path('M 20 30 Q 90 80 50 40');
  let base1 = Base.create(svg, 'T', 15, 10);
  let base2 = Base.create(svg, 'A', 100, 110);
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

describe('values function', () => {
  it('returns values', () => {
    // make all values different to test if they are mixed up
    bond.path.attr({
      'stroke': '#11da3f',
      'stroke-width': 7.21,
      'stroke-opacity': 0.435,
      'stroke-dasharray': '8 1.1 2 3.8',
    });
    bond.setPadding1(8.26);
    bond.setPadding2(13.05);
    let vs = values(bond);
    roundBasePaddings(vs, 3);
    expect(vs).toEqual({
      path: {
        'stroke': '#11da3f',
        'stroke-width': 7.21,
        'stroke-opacity': 0.435,
        'stroke-dasharray': '8 1.1 2 3.8',
      },
      basePadding1: 8.26,
      basePadding2: 13.05,
    });
  });
});

describe('setValues function', () => {
  it('sets values', () => {
    // make all values different to test if they are mixed up
    let vs1 = {
      path: {
        'stroke': '#45a09c',
        'stroke-width': 6.81,
        'stroke-opacity': 0.842,
        'stroke-dasharray': '9 7 5.2',
      },
      basePadding1: 18.29,
      basePadding2: 3.98,
    };
    setValues(bond, vs1);
    let vs2 = values(bond);
    roundBasePaddings(vs2, 3);
    expect(vs2).toEqual(vs1); // set values
  });

  it('handles undefined values', () => {
    let vs1 = {
      path: {
        'stroke': '#458abb',
        'stroke-width': 3.27,
        'stroke-opacity': 0.912,
        'stroke-dasharray': '1 1 2.37',
      },
      basePadding1: 5.59,
      basePadding2: 9.07,
    };
    setValues(bond, vs1);
    // should be able to handle a defined and undefined
    // path values object
    setValues(bond, { path: {} });
    setValues(bond, {});
    let vs2 = values(bond);
    roundBasePaddings(vs2, 3);
    // didn't set any values to undefined
    expect(vs2).toEqual(vs1);
  });
});
