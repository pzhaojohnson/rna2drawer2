import { SVGTextWrapper } from './text';
import { NodeSVG } from 'Draw/NodeSVG';

let container = null;
let svg = null;
let text = null;
let wrapper = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  text = svg.text('asdf qwer');
  wrapper = new SVGTextWrapper(text);
});

afterEach(() => {
  wrapper = null;
  text = null;

  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('SVGTextWrapper', () => {
  it('provides reference to wrapped text', () => {
    expect(wrapper.element).toBe(text);
  });
});
