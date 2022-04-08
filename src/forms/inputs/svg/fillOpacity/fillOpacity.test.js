import * as SVG from 'Draw/svg/NodeSVG';

import { fillOpacity } from './fillOpacity';
import { setFillOpacity } from './fillOpacity';

let container = null;
let svg = null;
let eles = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = SVG.SVG();
  svg.addTo(container);

  eles = [
    svg.rect(20, 1),
    svg.rect(2, 42),
    svg.circle(12),
    svg.text('asdf'),
    svg.path('M 50 55 H 200'),
    svg.path('M 0 1 Q 33 22 11 11'),
    svg.circle(50),
    svg.ellipse(10, 12),
    svg.ellipse(200, 300),
    svg.ellipse(1000, 22),
    svg.circle(2000),
  ];
});

afterEach(() => {
  eles = null;
  svg = null;

  container.remove();
  container = null;
});

describe('fillOpacity function', () => {
  test('one element', () => {
    let ele = eles[0];
    ele.attr('fill-opacity', 0.15);
    expect(fillOpacity([ele])).toBe(0.15);
  });

  test('multiple elements', () => {
    eles.forEach(ele => ele.attr('fill-opacity', 0.27));
    expect(fillOpacity(eles)).toBe(0.27);
  });

  test('an empty array of elements', () => {
    expect(fillOpacity([])).toBeUndefined();
  });

  test('when one element has a different fill-opacity', () => {
    eles.forEach(ele => ele.attr('fill-opacity', 0.41));
    expect(fillOpacity(eles)).toBe(0.41);
    eles[3].attr('fill-opacity', 0.42);
    expect(fillOpacity(eles)).toBeUndefined();
  });

  test('when multiple elements have a different stroke-opacity', () => {
    eles.forEach(ele => ele.attr('fill-opacity', 0.5));
    expect(fillOpacity(eles)).toBe(0.5);
    eles[3].attr('fill-opacity', 1);
    eles[2].attr('fill-opacity', 0);
    eles[5].attr('fill-opacity', 0.51);
    expect(fillOpacity(eles)).toBeUndefined();
  });

  test('a percentage fill-opacity', () => {
    let ele = eles[0];
    ele.attr('fill-opacity', '32%');
    expect(fillOpacity([ele])).toBe(0.32);
  });

  test('a nonnumeric fill-opacity', () => {
    let ele = eles[0];
    ele.attr('fill-opacity', 'blah');
    // check that nonnumeric values are not automatically ignored
    expect(ele.attr('fill-opacity')).toBe('blah');
    // nonnumeric values seem to be interpreted as zero
    expect(fillOpacity([ele])).toBe(0);
  });
});

describe('setFillOpacity function', () => {
  test('one element', () => {
    let ele = eles[0];
    ele.attr('fill-opacity', 0.3);
    setFillOpacity([ele], 0.5);
    expect(fillOpacity([ele])).toBe(0.5);
  });

  test('multiple elements', () => {
    eles.forEach(ele => ele.attr('fill-opacity', 0.17));
    setFillOpacity(eles, 0.21);
    expect(fillOpacity(eles)).toBe(0.21);
  });

  test('an empty array of elements', () => {
    expect(
      () => setFillOpacity([], 1)
    ).not.toThrow();
  });

  test('a negative value', () => {
    eles.forEach(ele => ele.attr('fill-opacity', 0.5));
    setFillOpacity(eles, -0.3);
    expect(fillOpacity(eles)).toBe(0);
  });

  test('a value greater than one', () => {
    eles.forEach(ele => ele.attr('fill-opacity', 0.25));
    setFillOpacity(eles, 1.11);
    expect(fillOpacity(eles)).toBe(1);
  });

  it('ignores nonfinite values', () => {
    eles.forEach(ele => ele.attr('fill-opacity', 0.81));
    setFillOpacity(eles, NaN);
    setFillOpacity(eles, Infinity);
    setFillOpacity(eles, -Infinity);
    expect(fillOpacity(eles)).toBe(0.81); // never changed
  });
});
