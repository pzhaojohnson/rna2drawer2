import { NodeSVG } from 'Draw/svg/NodeSVG';

import { bboxOfLine } from './bboxOfLine';

let container = null;
let svg = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);
});

afterEach(() => {
  svg = null;

  container.remove();
  container = null;
});

describe('bboxOfLine function', () => {
  test('a line that goes from top-left to bottom-right', () => {
    let line = svg.line(20, 18, 28.66, 13);
    line.attr('stroke-width', 8);
    let bbox = bboxOfLine(line);
    expect(bbox.x).toBeCloseTo(18);
    expect(bbox.y).toBeCloseTo(9.535923);
    expect(bbox.width).toBeCloseTo(12.660088);
    expect(bbox.height).toBeCloseTo(11.928152);
  });

  test('a line that goes from bottom-left to top-right', () => {
    let line = svg.line(-31, 1, -27, 32);
    line.attr('stroke-width', 5);
    let bbox = bboxOfLine(line);
    expect(bbox.x).toBeCloseTo(-33.479444);
    expect(bbox.y).toBeCloseTo(0.680071);
    expect(bbox.width).toBeCloseTo(8.958889);
    expect(bbox.height).toBeCloseTo(31.639856);
  });

  it('can handle string stroke widths', () => {
    let line = svg.line(5, 10, 5, 20);
    line.attr('stroke-width', '6px');
    let bbox = bboxOfLine(line);
    expect(bbox.x).toBeCloseTo(2);
    expect(bbox.y).toBeCloseTo(10);
    expect(bbox.width).toBeCloseTo(6);
    expect(bbox.height).toBeCloseTo(10);
  });
});
