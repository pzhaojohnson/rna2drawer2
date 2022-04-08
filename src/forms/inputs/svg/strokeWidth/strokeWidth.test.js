import * as SVG from 'Draw/svg/NodeSVG';

import { strokeWidth } from './strokeWidth';
import { setStrokeWidth } from './strokeWidth';

let container = null;
let svg = null;
let eles = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = SVG.SVG();
  svg.addTo(container);

  eles = [
    svg.circle(50),
    svg.line(-200, 0, 1, 8),
    svg.path('M 200 300 Q 10 0 -20 3'),
    svg.rect(100, 10),
    svg.circle(200),
    svg.rect(1000, 1000),
    svg.ellipse(20, 5),
    svg.circle(4),
    svg.circle(200),
  ];
});

afterEach(() => {
  eles = null;
  svg = null;

  container.remove();
  container = null;
});

describe('strokeWidth function', () => {
  test('one element', () => {
    let ele = eles[0];
    ele.attr('stroke-width', 45);
    expect(strokeWidth([ele])).toBe(45);
  });

  test('multiple elements', () => {
    eles.forEach(ele => ele.attr('stroke-width', 32.6));
    // different ways of expressing the same stroke-width
    eles[1].attr('stroke-width', '32.6');
    eles[2].attr('stroke-width', '32.6px');
    expect(strokeWidth(eles)).toBe(32.6);
  });

  test('an empty array of elements', () => {
    expect(strokeWidth([])).toBeUndefined();
  });

  test('when one element has a different stroke-width', () => {
    eles.forEach(ele => ele.attr('stroke-width', 2));
    expect(strokeWidth(eles)).toBe(2);
    eles[2].attr('stroke-width', 3);
    expect(strokeWidth(eles)).toBeUndefined();
  });

  test('when multiple elements have different stroke-widths', () => {
    eles.forEach(ele => ele.attr('stroke-width', 8));
    expect(strokeWidth(eles)).toBe(8);
    eles[1].attr('stroke-width', 6);
    eles[2].attr('stroke-width', 8.2);
    eles[5].attr('stroke-width', 11);
    expect(strokeWidth(eles)).toBeUndefined();
  });

  test('a nonnumeric stroke-width', () => {
    let ele = eles[0];
    ele.attr('stroke-width', 'asdf');
    // check that nonnumeric values are not automatically ignored
    expect(ele.attr('stroke-width')).toBe('asdf');
    // nonnumeric values seem to be interpreted as zero
    expect(strokeWidth([ele])).toBe(0);
  });
});

describe('setStrokeWidth function', () => {
  test('one element', () => {
    let ele = eles[0];
    ele.attr('stroke-width', 8);
    setStrokeWidth([ele], 10);
    expect(strokeWidth([ele])).toBe(10);
  });

  test('multiple elements', () => {
    eles.forEach(ele => ele.attr('stroke-width', 2));
    setStrokeWidth(eles, 3);
    expect(strokeWidth(eles)).toBe(3);
  });

  test('an empty array of elements', () => {
    expect(
      () => setStrokeWidth([], 2)
    ).not.toThrow();
  });

  test('a negative value', () => {
    setStrokeWidth(eles, -2);
    expect(strokeWidth(eles)).toBe(0);
  });

  it('ignores nonfinite values', () => {
    eles.forEach(ele => ele.attr('stroke-width', 3));
    setStrokeWidth(eles, NaN);
    setStrokeWidth(eles, Infinity);
    setStrokeWidth(eles, -Infinity);
    expect(strokeWidth(eles)).toBe(3); // never changed
  });
});
