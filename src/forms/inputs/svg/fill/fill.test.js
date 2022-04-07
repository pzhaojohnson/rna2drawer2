import * as SVG from '@svgdotjs/svg.js';
import * as NodeSVG from 'Draw/svg/NodeSVG';

import { fill } from './fill';
import { fillEquals } from './fill';

let container = null;
let svg = null;
let eles = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG.SVG();
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
    expect(fill([ele]).toHex()).toBe('#4566ac');
  });

  test('multiple elements', () => {
    eles.forEach(ele => ele.attr('fill', '#bbc2e4'));
    // test different ways of expressing colors
    eles[4].attr('fill', '#BBC2E4');
    eles[3].attr('fill', 'rgb(187, 194, 228)');
    eles[1].attr('fill', { r: 187, g: 194, b: 228 });
    expect(fill(eles).toHex()).toBe('#bbc2e4');
  });

  test('an empty array of elements', () => {
    expect(fill([])).toBeUndefined();
  });

  test('when one element has a different fill', () => {
    eles.forEach(ele => ele.attr('fill', '#bb1123'));
    expect(fill(eles).toHex()).toBe('#bb1123');
    eles[2].attr('fill', '#bb1122');
    expect(fill(eles)).toBeUndefined();
  });

  test('when multiple elements have a different fill', () => {
    eles.forEach(ele => ele.attr('fill', '#010203'));
    expect(fill(eles).toHex()).toBe('#010203');
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

describe('fillEquals function', () => {
  test('one element', () => {
    let ele = eles[0];
    ele.attr('fill', '#fe2887');
    expect(fillEquals([ele], new SVG.Color('#fe2887'))).toBeTruthy();
    expect(fillEquals([ele], new SVG.Color('#fd2887'))).toBeFalsy();
  });

  test('multiple elements', () => {
    eles.forEach(ele => ele.attr('fill', '#bbcca2'));
    expect(fillEquals(eles, new SVG.Color('#bbcca2'))).toBeTruthy();
    expect(fillEquals(eles, new SVG.Color('#bbcac2'))).toBeFalsy();
  });

  test('different ways of expressing the same color', () => {
    eles.forEach(ele => ele.attr('fill', '#1133bb'));
    expect(fillEquals(eles, new SVG.Color('#1133BB'))).toBeTruthy(); // UPPERCASE
    expect(fillEquals(eles, new SVG.Color('#13b'))).toBeTruthy(); // three character hex code
    expect(fillEquals(eles, new SVG.Color('rgb(17, 51, 187)'))).toBeTruthy(); // RGB string
  });

  test('when fill is undefined', () => {
    eles.forEach(ele => ele.attr('fill', '#bcadef'));
    eles[1].attr('fill', '#bcadee');
    expect(fill(eles)).toBeUndefined();
    expect(fillEquals(eles, new SVG.Color('#bcadef'))).toBeFalsy();
    expect(fillEquals(eles, new SVG.Color('#bcadee'))).toBeFalsy();
  });
});
