import * as SVG from '@svgdotjs/svg.js';

import { ColorsWrapper } from './ColorsWrapper';

describe('ColorsWrapper class', () => {
  test('colors property', () => {
    let cs = [new SVG.Color('#abcdef'), new SVG.Color('#123456')];
    let colors = new ColorsWrapper(cs);
    expect(colors.colors).toBe(cs);
  });

  describe('commonValue getter', () => {
    test('an empty array', () => {
      let colors = new ColorsWrapper([]);
      expect(colors.commonValue).toBeUndefined();
    });

    test('a single color', () => {
      let colors = new ColorsWrapper([new SVG.Color('#bdffa2')]);
      expect(colors.commonValue.toHex().toLowerCase()).toBe('#bdffa2');
    });

    test('instances of the same color', () => {
      let colors = new ColorsWrapper([
        new SVG.Color('#bb458d'), // lower case hex code
        new SVG.Color('#BB458D'), // upper case hex code
        new SVG.Color('rgb(187, 69, 141)'), // RGB string
        new SVG.Color({ r: 187, g: 69, b: 141 }), // RGB object
      ]);
      expect(colors.commonValue.toHex().toLowerCase()).toBe('#bb458d');
    });

    test('when one color is different', () => {
      let colors = new ColorsWrapper([
        new SVG.Color('#332baf'),
        new SVG.Color('#332baf'),
        new SVG.Color('#332caf'),
        new SVG.Color('#332baf'),
      ]);
      expect(colors.commonValue).toBeUndefined();
    });

    test('when all colors are different', () => {
      let colors = new ColorsWrapper([
        new SVG.Color('#332baf'),
        new SVG.Color('#342baf'),
        new SVG.Color('#332bef'),
      ]);
      expect(colors.commonValue).toBeUndefined();
    });

    test('a null value', () => {
      let colors = new ColorsWrapper([null, new SVG.Color('#abcdef')]);
      expect(colors.commonValue).toBeUndefined();
    });

    test('an undefined value', () => {
      let colors = new ColorsWrapper([undefined, new SVG.Color('#abcdef')]);
      expect(colors.commonValue).toBeUndefined();
    });
  });
});
