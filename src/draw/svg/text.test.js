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
    expect(wrapper.wrapped).toBe(text);
  });

  it('getter-setter methods', () => {
    [
      { name: 'text', value: 'a9e' },
    ].forEach(nv => {
      expect(text[nv.name]()).not.toEqual(nv.value);
      wrapper[nv.name](nv.value);
      expect(text[nv.name]()).toBe(nv.value); // sets
      expect(wrapper[nv.name]()).toBe(nv.value); // gets
    });
  });
});
