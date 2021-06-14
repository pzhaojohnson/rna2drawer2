import { roundNumbers } from './round';
import { NodeSVG } from 'Draw/NodeSVG';
import { BaseNumbering } from './BaseNumbering';

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
let numbering = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  numbering = BaseNumbering.create(svg, 200, { x: 50, y: 60 });
});

afterEach(() => {
  numbering = null;

  svg.clear();
  svg.remove();
  svg = null;
  
  container.remove();
  container = null;
});

describe('roundNumbers function', () => {
  it('has a default places argument', () => {
    expect(
      () => roundNumbers(numbering)
    ).not.toThrow();
  });

  it('can receive a places argument', () => {
    expect(
      () => roundNumbers(numbering, 6)
    ).not.toThrow();
  });

  it("doesn't mix up numbers", () => {
    // all numbers are different
    numbering.text.attr({
      'x': 50,
      'y': 60,
      'font-size': 24,
      'font-weight': 700,
    });
    numbering.line.attr({
      'x1': 80,
      'y1': 90,
      'x2': 100,
      'y2': 110,
      'stroke-width': 16,
    });
    // places argument is also different from all other numbers
    roundNumbers(numbering, 3);
    let ns = getNumbers(numbering);
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
