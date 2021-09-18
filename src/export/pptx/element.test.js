import { svgImageOptions } from './element';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { pixelsToInches } from 'Export/units';

let container = null;
let svg = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);
});

afterEach(() => {
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('svgImageOptions function', () => {
  it('ensures width and height are at least 1', () => {
    // a width or height of less than 1 can cause errors

    let line = svg.line(5, 5, 5, 5);
    line.attr('stroke-width', 0);

    // line occupies zero area
    let bbox = line.bbox();
    expect(bbox.width).toBe(0);
    expect(bbox.height).toBe(0);

    // SVG image is given extra area
    let options = svgImageOptions(line);
    expect(options.w).toBeGreaterThanOrEqual(pixelsToInches(1));
    expect(options.h).toBeGreaterThanOrEqual(pixelsToInches(1));
  });
});
