import { SVGElementWrapper } from './element';
import { NodeSVG } from 'Draw/NodeSVG';

let container = null;
let svg = null;
let element = null;
let wrapper = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  element = svg.circle(20);
  wrapper = new SVGElementWrapper(element);
});

afterEach(() => {
  wrapper = null;
  element = null;

  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('SVGElementWrapper', () => {
  it('provides reference to wrapped element', () => {
    expect(wrapper.wrapped).toBe(element);
  });

  describe('attr method', () => {
    it('gets attributes', () => {
      let stroke = '#ab1265';
      expect(element.attr('stroke')).not.toEqual(stroke);
      element.attr({ 'stroke': stroke });
      expect(wrapper.attr('stroke')).toBe(stroke);
    });

    describe('setting attributes', () => {
      it('with an object', () => {
        let strokeWidth = 6.881;
        let strokeOpacity = 0.12;
        expect(element.attr('stroke-width')).not.toEqual(strokeWidth);
        expect(element.attr('stroke-opacity')).not.toEqual(strokeOpacity);
        wrapper.attr({
          'stroke-width': strokeWidth,
          'stroke-opacity': strokeOpacity,
        });
        expect(element.attr('stroke-width')).toBe(strokeWidth);
        expect(element.attr('stroke-opacity')).toBe(strokeOpacity);
      });
    });

    it('can get all attributes', () => {
      let attrs = {
        'fill': '#ee1211',
        'fill-opacity': 0.98,
        'opacity': 0.56,
      };
      element.attr(attrs);
      expect(wrapper.attr()).toEqual(element.attr());
      expect(wrapper.attr()).toMatchObject(attrs);
    });
  });

  describe('css method', () => {
    it('gets properties', () => {
      let cursor = 'pointer';
      expect(element.css('cursor')).not.toEqual(cursor);
      element.css({ 'cursor': cursor });
      expect(wrapper.css('cursor')).toBe(cursor);
    });

    describe('setting properties', () => {
      it('with an object', () => {
        let cursor = 'pointer';
        let borderWidth = '3px';
        expect(element.css('cursor')).not.toEqual(cursor);
        expect(element.css('border-width')).not.toEqual(borderWidth);
        wrapper.css({
          'cursor': cursor,
          'border-width': borderWidth,
        });
        expect(element.css('cursor')).toBe(cursor);
        expect(element.css('border-width')).toBe(borderWidth);
      });
    });

    it('can get all properties', () => {
      let props = {
        'cursor': 'pointer',
        'border-width': '8px',
        'border-style': 'dashed',
      };
      element.css(props);
      expect(wrapper.css()).toEqual(element.css());
      expect(wrapper.css()).toMatchObject(props);
    });
  });

  it('getter methods', () => {
    [
      { name: 'root' },
      { name: 'position' },
      { name: 'svg' },
    ].forEach(n => {
      expect(wrapper[n.name]()).toEqual(element[n.name]());
    });
  });

  it('getter-setter methods', () => {
    [
      { name: 'id', value: (new Date()).toString() },
      { name: 'cx', value: 66.072 },
      { name: 'cy', value: 212.15 },
    ].forEach(nv => {
      expect(element[nv.name]()).not.toEqual(nv.value);
      wrapper[nv.name](nv.value);
      expect(element[nv.name]()).toBe(nv.value); // sets
      expect(wrapper[nv.name]()).toBe(nv.value); // gets
    });
  });

  it('event binders', () => {
    [
      { name: 'mouseover' },
      { name: 'mouseout' },
      { name: 'mousedown' },
      { name: 'dblclick' },
    ].forEach(event => {
      let f = jest.fn();
      wrapper[event.name](f);
      expect(f).not.toHaveBeenCalled();
      element.fire(event.name);
      expect(f).toHaveBeenCalled();
    });
  });

  it('other forwarded methods', () => {
    [
      { name: 'front', args: [] },
      { name: 'back', args: [] },
      { name: 'remove', args: [] },
    ].forEach(na => {
      let spy = jest.spyOn(element, na.name);
      expect(spy).not.toHaveBeenCalled();
      wrapper[na.name](...na.args);
      expect(spy).toHaveBeenCalled();
      let c = spy.mock.calls[0];
      expect(c).toEqual(na.args);
    });
  });
});
