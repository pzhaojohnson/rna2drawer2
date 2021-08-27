import { toPptxHex } from './color';
import * as SVG from '@svgdotjs/svg.js';

test('toPptxHex function', () => {
  [
    { hex: '#ab12dd', pptxHex: 'AB12DD' }, // removes leading #
    { hex: '#1fd', pptxHex: '11FFDD' }, // can expand to six characters
    { hex: '#aabbde', pptxHex: 'AABBDE' }, // capitalizes
    { hex: '#AABBDE', pptxHex: 'AABBDE' }, // handles already capitalized
  ].forEach(({ hex, pptxHex }) => {
    let c = new SVG.Color(hex);
    expect(toPptxHex(c)).toBe(pptxHex);
  });
});
