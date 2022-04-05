import * as SVG from 'Draw/svg/NodeSVG';

import { fill } from './fill';

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
    svg.rect(20, 30),
    svg.path('M 20 30 Q 100 2000 0 0 z'),
    svg.ellipse(100, 200),
    svg.ellipse(50, 3),
    svg.circle(10),
    svg.rect(200, 199),
    svg.rect(50, 50),
    svg.circle(3000),
    svg.path('M 20 20 H 500 V 300 z'),
    svg.rect(50, 60),
  ];
});

afterEach(() => {
  eles = null;
  svg = null;

  container.remove();
  container = null;
});

describe('fill function', () => {
  test('one element', () => {
    let ele = eles[0];
    ele.attr('fill', '#4566ac');
    expect(fill([ele])).toBe('#4566ac');
  });

  test('multiple elements', () => {
    eles.forEach(ele => ele.attr('fill', '#bbc2e4'));
    // test different ways of expressing colors
    eles[4].attr('fill', '#BBC2E4');
    eles[3].attr('fill', 'rgb(187, 194, 228)');
    eles[1].attr('fill', { r: 187, g: 194, b: 228 });
    expect(fill(eles)).toBe('#bbc2e4');
  });

  test('an empty array of elements', () => {
    expect(fill([])).toBeUndefined();
  });

  test('when one element has a different fill', () => {
    eles.forEach(ele => ele.attr('fill', '#bb1123'));
    expect(fill(eles)).toBe('#bb1123');
    eles[2].attr('fill', '#bb1122');
    expect(fill(eles)).toBeUndefined();
  });

  test('when multiple elements have a different fill', () => {
    eles.forEach(ele => ele.attr('fill', '#010203'));
    expect(fill(eles)).toBe('#010203');
    eles[1].attr('fill', '#102030');
    eles[3].attr('fill', '#bbca22');
    eles[4].attr('fill', '#45bcaf');
    expect(fill(eles)).toBeUndefined();
  });

  test('when an element has a fill that is not a color', () => {
    let ele = eles[0];
    ele.attr('fill', 'qwer');
    // check that non-color values are not automatically ignored
    expect(ele.attr('fill')).toBe('qwer');
    expect(fill([ele])).toBeUndefined();
  });
});
