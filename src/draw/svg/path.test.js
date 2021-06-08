import { SVGPathWrapper } from './path';
import { NodeSVG } from 'Draw/NodeSVG';

let container = null;
let svg = null;
let path = null;
let wrapper = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  path = svg.path('M 10 20 Q 75 80 200 112');
  wrapper = new SVGPathWrapper(path);
});

afterEach(() => {
  wrapper = null;
  path = null;

  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('SVGPathWrapper', () => {
  it('provides reference to wrapped path', () => {
    expect(wrapper.element).toBe(path);
  });

  describe('CSS properties', () => {
    it('gets and sets', () => {
      [
        { prop: 'cursor', css: 'cursor', value: 'pointer' },
      ].forEach(pcv => {
        expect(path.css(pcv.css)).not.toEqual(pcv.value);
        wrapper[pcv.prop] = pcv.value;
        expect(path.css(pcv.css)).toBe(pcv.value); // sets
        expect(wrapper[pcv.prop]).toBe(pcv.value); // gets
      });
    });
  });
});
