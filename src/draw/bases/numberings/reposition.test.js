import { reposition } from './reposition';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { Base } from 'Draw/bases/Base';
import { addNumbering } from './add';

let container = null;
let svg = null;
let base = null;
let numbering = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  base = Base.create(svg, 'G', 20, 200);
  addNumbering(base, 1012);
  numbering = base.numbering;
});

afterEach(() => {
  numbering = null;
  base = null;

  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('reposition function', () => {
  it('repositions line and text', () => {
    numbering.text.attr({ 'font-size': 18 });
    reposition(numbering, {
      baseCenter: { x: 112, y: 902 },
      basePadding: 16,
      lineAngle: 3,
      lineLength: 7.5,
      textPadding: 8,
    });
    expect(numbering.line.attr('x1')).toBeCloseTo(96.16012);
    expect(numbering.line.attr('y1')).toBeCloseTo(904.25792);
    expect(numbering.line.attr('x2')).toBeCloseTo(88.73517);
    expect(numbering.line.attr('y2')).toBeCloseTo(905.31632);
    expect(numbering.text.attr('x')).toBeCloseTo(80.81523);
    expect(numbering.text.attr('y')).toBeCloseTo(913.64528);
    expect(numbering.text.attr('text-anchor')).toBe('end');
  });

  it('smoke test', () => {
    for (let i = 0; i < 200; i++) {
      let fs = (30 * Math.random()) + 3;
      let p = {
        baseCenter: {
          x: (1000 * Math.random()) - 300, // include negative coordinates
          y: (1000 * Math.random()) - 300,
        },
        basePadding: 60 * Math.random(),
        lineAngle: (1000 * Math.random()) - 500, // include negative angles
        lineLength: 100 * Math.random(),
        textPadding: 50 * Math.random(),
      };
      numbering.text.attr({ 'font-size': fs });
      expect(
        () => reposition(numbering, p)
      ).not.toThrow();
    }
  });
});
