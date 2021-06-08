import { SVGLineWrapper } from './line';
import { NodeSVG } from 'Draw/NodeSVG';

let container = null;
let svg = null;
let line = null;
let wrapper = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  line = svg.line(10, 20, 30, 40);
  wrapper = new SVGLineWrapper(line);
});

afterEach(() => {
  wrapper = null;
  line = null;

  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('SVGLineWrapper', () => {
  it('provides reference to wrapped line', () => {
    expect(wrapper.element).toBe(line);
  });
});
