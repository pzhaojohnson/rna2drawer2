import * as SVG from 'Draw/svg/NodeSVG';

import { strokeOpacity } from './strokeOpacity';
import { setStrokeOpacity } from './strokeOpacity';

let container = null;
let svg = null;
let eles = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = SVG.SVG();
  svg.addTo(container);

  eles = [
    svg.line(1, 2, 3, 4),
    svg.circle(50),
    svg.rect(80, 90),
    svg.line(0, 0, 1000, 2000),
    svg.line(-900, -980, -1, -2),
    svg.circle(2),
    svg.ellipse(40, 30),
    svg.rect(1000, 2),
    svg.circle(80),
    svg.path('M 50 60 Q 111 222 33 4'),
  ];
});

afterEach(() => {
  eles = null;
  svg = null;

  container.remove();
  container = null;
});

describe('strokeOpacity function', () => {
  test('one element', () => {
    let ele = eles[0];
    ele.attr('stroke-opacity', 0.67);
    expect(strokeOpacity([ele])).toBe(0.67);
  });

  test('multiple elements', () => {
    eles.forEach(ele => ele.attr('stroke-opacity', 0.41));
    expect(strokeOpacity(eles)).toBe(0.41);
  });

  test('an empty array of elements', () => {
    expect(strokeOpacity([])).toBeUndefined();
  });

  test('when one element has a different stroke-opacity', () => {
    eles.forEach(ele => ele.attr('stroke-opacity', 0.12));
    expect(strokeOpacity(eles)).toBe(0.12);
    eles[3].attr('stroke-opacity', 0.87);
    expect(strokeOpacity(eles)).toBeUndefined();
  });

  test('when multiple elements have a different stroke-opacity', () => {
    eles.forEach(ele => ele.attr('stroke-opacity', 0.5));
    expect(strokeOpacity(eles)).toBe(0.5);
    eles[0].attr('stroke-opacity', 1);
    eles[2].attr('stroke-opacity', 0);
    eles[3].attr('stroke-opacity', 0.49);
    expect(strokeOpacity(eles)).toBeUndefined();
  });

  test('a percentage stroke-opacity', () => {
    let ele = eles[0];
    ele.attr('stroke-opacity', '53%');
    expect(strokeOpacity([ele])).toBe(0.53);
  });

  test('a nonnumeric stroke-opacity', () => {
    let ele = eles[0];
    ele.attr('stroke-opacity', 'qwer');
    // check that nonnumeric values are not automatically ignored
    expect(ele.attr('stroke-opacity')).toBe('qwer');
    // nonnumeric values seem to be interpreted as zero
    expect(strokeOpacity([ele])).toBe(0);
  });
});

describe('setStrokeOpacity function', () => {
  test('one element', () => {
    let ele = eles[0];
    ele.attr('stroke-opacity', 0.32);
    setStrokeOpacity([ele], 0.05);
    expect(strokeOpacity([ele])).toBe(0.05);
  });

  test('multiple elements', () => {
    eles.forEach(ele => ele.attr('stroke-opacity', 0.1));
    setStrokeOpacity(eles, 0.25);
    expect(strokeOpacity(eles)).toBe(0.25);
  });

  test('an empty array of elements', () => {
    expect(
      () => setStrokeOpacity([], 1)
    ).not.toThrow();
  });

  test('a negative value', () => {
    eles.forEach(ele => ele.attr('stroke-opacity', 1));
    setStrokeOpacity(eles, -0.2);
    expect(strokeOpacity(eles)).toBe(0);
  });

  test('a value greater than one', () => {
    eles.forEach(ele => ele.attr('stroke-opacity', 0));
    setStrokeOpacity(eles, 1.5);
    expect(strokeOpacity(eles)).toBe(1);
  });

  it('ignores nonfinite values', () => {
    eles.forEach(ele => ele.attr('stroke-opacity', 0.27));
    setStrokeOpacity(eles, NaN);
    setStrokeOpacity(eles, Infinity);
    setStrokeOpacity(eles, -Infinity);
    expect(strokeOpacity(eles)).toBe(0.27); // never changed
  });
});
