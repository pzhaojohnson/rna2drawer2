import { areAllSameColor } from './areAllSameColor';
import * as Svg from '@svgdotjs/svg.js';

let c1 = new Svg.Color('#aabc56');
let c2 = new Svg.Color('#AABC56');
let c3 = new Svg.Color('#1256ba');
let c4 = new Svg.Color('#55B3ff');
let c5 = new Svg.Color('#1256BA');
let c6 = new Svg.Color('#55fa2b');
let c7 = new Svg.Color('#1256ba');

it('are all same color', () => {
  expect(areAllSameColor([c1])).toBeTruthy();
  expect(areAllSameColor([c1, c2])).toBeTruthy();
  expect(areAllSameColor([c3, c5, c7])).toBeTruthy();
});

it('are not all same color', () => {
  expect(areAllSameColor([c2, c6])).toBeFalsy();
  expect(areAllSameColor([c1, c2, c4])).toBeFalsy(); // some are same color
});
