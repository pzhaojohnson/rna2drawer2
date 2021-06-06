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
    expect(wrapper.text).toBe(text);
  });

  describe('properties for SVG attributes', () => {
    it('gets and sets', () => {
      [
        { prop: 'x', attr: 'x', value: 112.312 },
        { prop: 'y', attr: 'y', value: 88.711 },
        { prop: 'fontFamily', attr: 'font-family', value: 'Courier New' },
        { prop: 'fontSize', attr: 'font-size', value: 16.2 },
        { prop: 'fontWeight', attr: 'font-weight', value: 625 },
        { prop: 'fontStyle', attr: 'font-style', value: 'italic' },
        { prop: 'fill', attr: 'fill', value: '#bacd36' },
        { prop: 'fillOpacity', attr: 'fill-opacity', value: 0.233 },
      ].forEach(pav => {
        expect(text.attr(pav.attr)).not.toEqual(pav.value);
        wrapper[pav.prop] = pav.value;
        expect(text.attr(pav.attr)).toBe(pav.value); // sets
        expect(wrapper[pav.prop]).toBe(pav.value); // gets
      });
    });
  });

  describe('CSS properties', () => {
    it('gets and sets', () => {
      [
        { prop: 'cursor', css: 'cursor', value: 'pointer' },
      ].forEach(pcv => {
        expect(text.css(pcv.css)).not.toEqual(pcv.value);
        wrapper[pcv.prop] = pcv.value;
        expect(text.css(pcv.css)).toBe(pcv.value); // sets
        expect(wrapper[pcv.prop]).toBe(pcv.value); // gets
      });
    });
  });

  describe('getter and setter methods', () => {
    it('gets and sets', () => {
      [
        { name: 'id', value: (new Date()).toString() },
        { name: 'cx', value: 72.089 },
        { name: 'cy', value: 212.709 },
      ].forEach(m => {
        expect(text[m.name]()).not.toEqual(m.value);
        wrapper[m.name](m.value);
        expect(text[m.name]()).toBe(m.value); // sets
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
      ].forEach(e => {
        let f = jest.fn();
        wrapper[e.name](f);
        expect(f).not.toHaveBeenCalled();
        text.fire(e.name);
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
        let spy = jest.spyOn(text, m.name);
        expect(spy).not.toHaveBeenCalled();
        wrapper[m.name](...m.args);
        expect(spy).toHaveBeenCalled();
        let c = spy.mock.calls[0];
        expect(c).toEqual(m.args);
      });
    });
  });
});
