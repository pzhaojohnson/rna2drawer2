import * as SVG from 'Draw/svg/NodeSVG';

import { SVGElementsWrapper } from './SVGElementsWrapper';

let container = null;
let svg = null;
let elements = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = SVG.SVG();
  svg.addTo(container);

  elements = new SVGElementsWrapper([
    svg.circle(20),
    svg.rect(10, 30),
    svg.path('M 50 500 Q 2 3 50 88 Z'),
    svg.ellipse(100, 90),
    svg.circle(55.5),
    svg.rect(60, 60),
  ]);
});

afterEach(() => {
  elements = null;

  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('SVGElementsWrapper class', () => {
  test('elements property', () => {
    let eles = [svg.circle(20), svg.rect(30, 30)];
    let elements = new SVGElementsWrapper(eles);
    expect(elements.elements).toBe(eles);
  });

  describe('getAttribute method', () => {
    test('an empty array of elements', () => {
      let elements = new SVGElementsWrapper([]);
      expect(elements.getAttribute('name')).toBeUndefined();
    });

    test('an array containing a single element', () => {
      let elements = new SVGElementsWrapper([svg.circle(55)]);
      elements.elements[0].attr('stroke', '#abb328');
      expect(elements.getAttribute('stroke')).toBe('#abb328');
    });

    test('multiple elements with a common value', () => {
      expect(elements.elements.length).toBeGreaterThan(3);
      elements.elements.forEach(ele => ele.attr('fill', '#192bc5'));
      expect(elements.getAttribute('fill')).toBe('#192bc5');
    });

    test('one element having a different value', () => {
      expect(elements.elements.length).toBeGreaterThan(3);
      elements.elements.forEach(ele => ele.attr('stroke', '#111111'));
      expect(elements.getAttribute('stroke')).toBe('#111111');
      elements.elements[2].attr('stroke', '#111112');
      expect(elements.getAttribute('stroke')).toBeUndefined();
    });

    test('an uninitialized attribute', () => {
      let elements = new SVGElementsWrapper([svg.rect(20, 10)]);
      expect(elements.elements[0].attr('id')).toBeUndefined();
      expect(elements.getAttribute('id')).toBeUndefined();
    });
  });

  describe('getNumericAttribute method', () => {
    test('an empty array of elements', () => {
      let elements = new SVGElementsWrapper([]);
      expect(elements.getNumericAttribute('name')).toBeUndefined();
    });

    test('an array containing a single element', () => {
      let elements = new SVGElementsWrapper([svg.circle(55)]);
      elements.elements[0].attr('r', 27.5);
      expect(elements.getNumericAttribute('r')).toBe(27.5);
    });

    test('a nonnumeric value', () => {
      let elements = new SVGElementsWrapper([svg.rect(20, 20)]);
      elements.elements[0].attr('id', 'asdf');
      // nonnumeric values seem to be interpreted as zero
      expect(elements.getNumericAttribute('id')).toBe(0);
    });

    test('a percentage value', () => {
      let elements = new SVGElementsWrapper([svg.circle(30)]);
      elements.elements[0].attr('fill-opacity', '85%');
      expect(elements.getNumericAttribute('fill-opacity')).toBe(0.85);
    });

    test('multiple elements with a common value', () => {
      expect(elements.elements.length).toBeGreaterThan(5);
      elements.elements.forEach(ele => ele.attr('stroke-width', 8.62));
      elements.elements[1].attr('stroke-width', '8.62'); // a string with no units
      elements.elements[2].attr('stroke-width', '8.62px'); // with pixel units
      elements.elements[3].attr('stroke-width', '8.62pt'); // non-pixel units are ignored
      expect(elements.getNumericAttribute('stroke-width')).toBe(8.62);
    });

    test('one element having a different value', () => {
      expect(elements.elements.length).toBeGreaterThan(3);
      elements.elements.forEach(ele => ele.attr('stroke-width', 3));
      expect(elements.getNumericAttribute('stroke-width')).toBe(3);
      elements.elements[2].attr('stroke-width', 2.99);
      expect(elements.getNumericAttribute('stroke-width')).toBeUndefined()
    });

    test('places option', () => {
      expect(elements.elements.length).toBeGreaterThan(5);
      elements.elements.forEach(ele => ele.attr('stroke-width', 6.38662));
      elements.elements[1].attr('stroke-width', 6.38705); // different without rounding
      elements.elements[2].attr('stroke-width', 6.38681);
      expect(elements.getNumericAttribute('stroke-width')).toBeUndefined();
      // round to the same value
      expect(elements.getNumericAttribute('stroke-width', { places: 3 })).toBe(6.387);
    });
  });
});
