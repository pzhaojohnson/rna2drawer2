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
    expect(wrapper.path).toBe(path);
  });

  describe('properties for SVG attributes', () => {
    it('gets and sets', () => {
      [
        { prop: 'd', attr: 'd', value: 'M 22.2 300 Q 600 800 50 55' },
        { prop: 'stroke', attr: 'stroke', value: '#4512ac' },
        { prop: 'strokeWidth', attr: 'stroke-width', value: 7.81 },
        { prop: 'strokeOpacity', attr: 'stroke-opacity', value: 0.72 },
        { prop: 'strokeDasharray', attr: 'stroke-dasharray', value: '1 2 8 2.2' },
        { prop: 'fill', attr: 'fill', value: '#bacd36' },
        { prop: 'fillOpacity', attr: 'fill-opacity', value: 0.233 },
      ].forEach(pav => {
        expect(path.attr(pav.attr)).not.toEqual(pav.value);
        wrapper[pav.prop] = pav.value;
        expect(path.attr(pav.attr)).toBe(pav.value); // sets
        expect(wrapper[pav.prop]).toBe(pav.value); // gets
      });
    });
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

  describe('getter and setter methods', () => {
    it('gets and sets', () => {
      [
        { name: 'id', value: (new Date()).toString() },
      ].forEach(m => {
        expect(path[m.name]()).not.toEqual(m.value);
        wrapper[m.name](m.value);
        expect(path[m.name]()).toBe(m.value); // sets
        expect(wrapper[m.name]()).toBe(m.value); // gets
      });
    });
  });

  describe('event binders', () => {
    it('binds', () => {
      [
        { name: 'mouseover' },
        { name: 'mouseout' },
        { name: 'mousedown' },
        { name: 'dblclick' },
      ].forEach(e => {
        let f = jest.fn();
        wrapper[e.name](f);
        expect(f).not.toHaveBeenCalled();
        path.fire(e.name);
        expect(f).toHaveBeenCalled();
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
        let spy = jest.spyOn(path, m.name);
        expect(spy).not.toHaveBeenCalled();
        wrapper[m.name](...m.args);
        expect(spy).toHaveBeenCalled();
        let c = spy.mock.calls[0];
        expect(c).toEqual(m.args);
      });
    });
  });
});
