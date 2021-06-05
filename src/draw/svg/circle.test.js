import { SVGCircleWrapper } from './circle';
import { NodeSVG } from 'Draw/NodeSVG';

let container = null;
let svg = null;
let circle = null;
let wrapper = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  circle = svg.circle(20);
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
    expect(wrapper.circle).toBe(circle);
  });

  describe('properties for SVG attributes', () => {
    it('gets and sets', () => {
      [
        { prop: 'r', attr: 'r', value: 8.128 },
        { prop: 'cx', attr: 'cx', value: 102.011 },
        { prop: 'cy', attr: 'cy', value: 99.312 },
        { prop: 'stroke', attr: 'stroke', value: '#ab4612' },
        { prop: 'strokeWidth', attr: 'stroke-width', value: 3.147 },
        { prop: 'strokeOpacity', attr: 'stroke-opacity', value: 0.622 },
        { prop: 'strokeDasharray', attr: 'stroke-dasharray', value: '3 1 2 3 2 2' },
        { prop: 'fill', attr: 'fill', value: '#bbcc29' },
        { prop: 'fillOpacity', attr: 'fill-opacity', value: 0.9506 },
      ].forEach(pav => {
        wrapper[pav.prop] = pav.value;
        expect(circle.attr(pav.attr)).toBe(pav.value); // sets
        expect(wrapper[pav.prop]).toBe(pav.value); // gets
      });
    });
  });

  describe('getter and setter methods', () => {
    it('gets and sets', () => {
      [
        { name: 'id', value: (new Date()).toString() },
      ].forEach(m => {
        wrapper[m.name](m.value);
        expect(circle[m.name]()).toBe(m.value); // sets
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
        let spy = jest.spyOn(circle, m.name);
        expect(spy).not.toHaveBeenCalled();
        wrapper[m.name](...m.args);
        expect(spy).toHaveBeenCalled();
        let c = spy.mock.calls[0];
        expect(c).toEqual(m.args);
      });
    });
  });
});
