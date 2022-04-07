import * as SVG from 'Draw/svg/NodeSVG';

import { stroke } from './stroke';

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
    svg.rect(10, 1000),
    svg.line(50, 20, 10, 333),
    svg.path('M 50 50 H 3000 V 20'),
    svg.path('M 0 2 Q 1 2 5 66'),
    svg.circle(100),
    svg.ellipse(20, 30),
    svg.line(-100, -200, 0, 0),
    svg.rect(20, 25),
    svg.circle(2000),
    svg.circle(225),
  ];
});

afterEach(() => {
  eles = null;
  svg = null;

  container.remove();
  container = null;
});

describe('stroke function', () => {
  test('one element', () => {
    let ele = eles[0];
    ele.attr('stroke', '#0023fb');
    expect(stroke([ele]).toHex()).toBe('#0023fb');
  });

  test('multiple elements', () => {
    eles.forEach(ele => ele.attr('stroke', '#12bca5'));
    // test different ways of expressing colors
    eles[4].attr('stroke', '#12BCA5');
    eles[2].attr('stroke', 'rgb(18, 188, 165)');
    eles[1].attr('stroke', { r: 18, g: 188, b: 165 });
    expect(stroke(eles).toHex()).toBe('#12bca5');
  });

  test('an empty array of elements', () => {
    expect(stroke([])).toBeUndefined();
  });

  test('when one element has a different stroke', () => {
    eles.forEach(ele => ele.attr('stroke', '#44bbf9'));
    expect(stroke(eles).toHex()).toBe('#44bbf9');
    eles[4].attr('stroke', '#44bbf8');
    expect(stroke(eles)).toBeUndefined();
  });

  test('when multiple elements have a different stroke', () => {
    eles.forEach(ele => ele.attr('stroke', '#abcde1'));
    expect(stroke(eles).toHex()).toBe('#abcde1');
    eles[0].attr('stroke', '#abcde2');
    eles[1].attr('stroke', '#2edcba');
    eles[4].attr('stroke', 'rgb(100, 88, 17)');
    expect(stroke(eles)).toBeUndefined();
  });

  test('when an element has a stroke that is not a color', () => {
    let ele = eles[0];
    ele.attr('stroke', 'asdf');
    // check that non-color values are not automatically ignored
    expect(ele.attr('stroke')).toBe('asdf');
    expect(stroke([ele])).toBeUndefined();
  });
});
