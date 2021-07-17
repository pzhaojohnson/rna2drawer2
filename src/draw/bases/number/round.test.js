import { roundNumbers } from './round';
import { NodeSVG } from 'Draw/NodeSVG';
import { Base } from 'Draw/bases/Base';
import { addNumbering } from './add';

function getNumbers(bn) {
  let ns = {
    text: {},
    line: {},
  };
  ['x', 'y', 'font-size', 'font-weight'].forEach(attr => {
    ns.text[attr] = bn.text.attr(attr);
  });
  ['x1', 'y1', 'x2', 'y2', 'stroke-width'].forEach(attr => {
    ns.line[attr] = bn.line.attr(attr);
  });
  return ns;
}

let container = null;
let svg = null;
let base = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  base = Base.create(svg, 'A', 200, 300);
  addNumbering(base, 500);
});

afterEach(() => {
  base = null;
  
  svg.clear();
  svg.remove();
  svg = null;
  
  container.remove();
  container = null;
});

describe('roundNumbers function', () => {
  it('has a default places argument', () => {
    expect(
      () => roundNumbers(base.numbering)
    ).not.toThrow();
  });

  it('can receive a places argument', () => {
    expect(
      () => roundNumbers(base.numbering, 6)
    ).not.toThrow();
  });

  it("doesn't mix up numbers", () => {
    // all numbers are different
    base.numbering.text.attr({
      'x': 50,
      'y': 60,
      'font-size': 24,
      'font-weight': 700,
    });
    base.numbering.line.attr({
      'x1': 80,
      'y1': 90,
      'x2': 100,
      'y2': 110,
      'stroke-width': 16,
    });
    // places argument is also different from all other numbers
    roundNumbers(base.numbering, 3);
    let ns = getNumbers(base.numbering);
    // since no numbers needed rounding
    expect(ns).toEqual({
      text: {
        'x': 50,
        'y': 60,
        'font-size': 24,
        'font-weight': 700,
      },
      line: {
        'x1': 80,
        'y1': 90,
        'x2': 100,
        'y2': 110,
        'stroke-width': 16,
      },
    });
  });
});
