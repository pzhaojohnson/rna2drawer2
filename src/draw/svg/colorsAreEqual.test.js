import * as SVG from '@svgdotjs/svg.js';

import { colorsAreEqual } from './colorsAreEqual';

test('colorsAreEqual function', () => {
  let color1 = new SVG.Color('#aa66ee');

  // UPPERCASE
  expect(colorsAreEqual(color1, new SVG.Color('#AA66EE'))).toBeTruthy();
  // three character hex code
  expect(colorsAreEqual(color1, new SVG.Color('#a6e'))).toBeTruthy();
  // RGB string
  expect(colorsAreEqual(color1, new SVG.Color('rgb(170, 102, 238)'))).toBeTruthy();
  // RGB object
  expect(colorsAreEqual(color1, new SVG.Color({ r: 170, g: 102, b: 238 }))).toBeTruthy();
  // RGB parameters list
  expect(colorsAreEqual(color1, new SVG.Color(170, 102, 238, 'rgb'))).toBeTruthy();

  // not equal
  expect(colorsAreEqual(color1, new SVG.Color('#ba66ee'))).toBeFalsy(); // test each hex character
  expect(colorsAreEqual(color1, new SVG.Color('#a266ee'))).toBeFalsy();
  expect(colorsAreEqual(color1, new SVG.Color('#aa56ee'))).toBeFalsy();
  expect(colorsAreEqual(color1, new SVG.Color('#aa67ee'))).toBeFalsy();
  expect(colorsAreEqual(color1, new SVG.Color('#aa66fe'))).toBeFalsy();
  expect(colorsAreEqual(color1, new SVG.Color('#aa66ef'))).toBeFalsy();
  expect(colorsAreEqual(color1, new SVG.Color('rgb(169, 102, 238)'))).toBeFalsy(); // test each RGB value
  expect(colorsAreEqual(color1, new SVG.Color('rgb(170, 103, 238)'))).toBeFalsy();
  expect(colorsAreEqual(color1, new SVG.Color('rgb(170, 102, 239)'))).toBeFalsy();
});
