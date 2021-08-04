import { SVGCircleWrapper } from './circle';
import { NodeSVG } from 'Draw/svg/NodeSVG';

let container = null;
let svg = null;
let circle = null;
let wrapper = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  circle = svg.circle(10);
  wrapper = new SVGCircleWrapper(circle);
});

afterEach(() => {
  wrapper = null;
  circle = null;

  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('SVGCircleWrapper', () => {
  it('provides reference to wrapped circle', () => {
    expect(wrapper.wrapped).toBe(circle);
  });
});
