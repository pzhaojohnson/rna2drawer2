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
    expect(wrapper.line).toBe(line);
  });

  describe('properties for SVG attributes', () => {
    it('gets and sets', () => {
      [
        { prop: 'x1', attr: 'x1', value: 90.123 },
        { prop: 'y1', attr: 'y1', value: 71.78 },
        { prop: 'x2', attr: 'x2', value: 2002.022 },
        { prop: 'y2', attr: 'y2', value: 69.96 },
        { prop: 'stroke', attr: 'stroke', value: '#abcc22' },
        { prop: 'strokeWidth', attr: 'stroke-width', value: 3.121 },
        { prop: 'strokeOpacity', attr: 'stroke-opacity', value: 0.506 },
      ].forEach(pav => {
        expect(line.attr(pav.attr)).not.toEqual(pav.value);
        wrapper[pav.prop] = pav.value;
        expect(line.attr(pav.attr)).toBe(pav.value); // sets
        expect(wrapper[pav.prop]).toBe(pav.value); // gets
      });
    });
  });

  describe('getter and setter methods', () => {
    it('gets and sets', () => {
      [
        { name: 'id', value: (new Date()).toString() }
      ].forEach(m => {
        expect(line[m.name]()).not.toEqual(m.value);
        wrapper[m.name](m.value);
        expect(line[m.name]()).toBe(m.value); // sets
        expect(wrapper[m.name]()).toBe(m.value); // gets
      });
    });
  });

  describe('other forwarded methods', () => {
    it('forwards', () => {
      [
        { name: 'front', args: [] },
        { name: 'back', args: [] },
        { name: 'remove', args: [] },
      ].forEach(m => {
        let spy = jest.spyOn(line, m.name);
        expect(spy).not.toHaveBeenCalled();
        wrapper[m.name](...m.args);
        expect(spy).toHaveBeenCalled();
        let c = spy.mock.calls[0];
        expect(c).toEqual(m.args);
      });
    });
  });
});
