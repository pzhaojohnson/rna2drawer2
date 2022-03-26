import * as SVG from 'Draw/svg/NodeSVG';

import { isStrokeLinecapValue } from './strokeLinecap';
import { strokeLinecap } from './strokeLinecap';
import { setStrokeLinecap } from './strokeLinecap';

let container = null;
let svg = null;
let eles = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = SVG.SVG();
  svg.addTo(container);

  eles = [
    svg.line(1, 20, 300, 4000),
    svg.path('M 20 30 Q 55 555 2 1'),
    svg.line(1000, 990, 980, 970),
    svg.path('M 50 60 H 1000 Z'),
    svg.line(0, 0, 20, 20),
  ];
});

afterEach(() => {
  eles = null;
  svg = null;

  container.remove();
  container = null;
});

test('isStrokeLinecapValue function', () => {
  expect(isStrokeLinecapValue('butt')).toBeTruthy();
  expect(isStrokeLinecapValue('round')).toBeTruthy();
  expect(isStrokeLinecapValue('square')).toBeTruthy();

  expect(isStrokeLinecapValue('but')).toBeFalsy();
  expect(isStrokeLinecapValue('ROUND')).toBeFalsy();
  expect(isStrokeLinecapValue('Square')).toBeFalsy();
  expect(isStrokeLinecapValue('asdf')).toBeFalsy();
  expect(isStrokeLinecapValue(2)).toBeFalsy();
  expect(isStrokeLinecapValue(true)).toBeFalsy();
  expect(isStrokeLinecapValue({})).toBeFalsy();
  expect(isStrokeLinecapValue(null)).toBeFalsy();
  expect(isStrokeLinecapValue()).toBeFalsy();
});

describe('strokeLinecap function', () => {
  test('when all elements have the same stroke-linecap', () => {
    expect(strokeLinecap(eles)).not.toBe('square');
    eles.forEach(ele => ele.attr('stroke-linecap', 'square'));
    expect(strokeLinecap(eles)).toBe('square');
  });

  test('when one element has a different stroke-linecap', () => {
    eles.forEach(ele => ele.attr('stroke-linecap', 'round'));
    expect(strokeLinecap(eles)).toBe('round');
    eles[2].attr('stroke-linecap', 'butt');
    expect(strokeLinecap(eles)).toBeUndefined();
  });

  test('an empty array of elements', () => {
    expect(strokeLinecap([])).toBeUndefined();
  });
});

describe('setStrokeLinecap function', () => {
  test('setting to a valid value', () => {
    setStrokeLinecap(eles, 'butt');
    expect(strokeLinecap(eles)).toBe('butt');
    setStrokeLinecap(eles, 'round');
    expect(strokeLinecap(eles)).toBe('round');
    setStrokeLinecap(eles, 'square');
    expect(strokeLinecap(eles)).toBe('square');
  });

  test('setting to an invalid value', () => {
    setStrokeLinecap(eles, 'round');
    expect(strokeLinecap(eles)).toBe('round');
    setStrokeLinecap(eles, 'but');
    setStrokeLinecap(eles, 'asdf');
    setStrokeLinecap(eles, 2);
    setStrokeLinecap(eles, null);
    setStrokeLinecap(eles);
    expect(strokeLinecap(eles)).toBe('round'); // never changed
  });
});
