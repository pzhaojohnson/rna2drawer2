import { BaseInterface as Base } from 'Draw/BaseInterface';
import * as SVG from '@svgdotjs/svg.js';
import { SVGTextWrapper as TextWrapper } from 'Draw/svg/text';
import { SVGLineWrapper as LineWrapper } from 'Draw/svg/line';
import { BaseNumbering } from './BaseNumbering';
import { setValues } from './values';

function addText(svg: SVG.Svg, n: number): SVG.Text {  

  // input an empty function instead of an empty string
  // in case an empty string results in an empty tspan
  // being added
  let text = svg.text(() => {});

  // doesn't add a tspan
  text.plain(n.toString());
  
  return text;
}

export function addNumbering(b: Base, n: number) {
  removeNumbering(b);
  let svg = b.text.root();
  if (typeof svg == 'object' && svg.constructor == SVG.Svg) {
    let text = addText(svg, n);
    let line = svg.line(0, 0, 1, 1);
    let bn = new BaseNumbering(
      new TextWrapper(text),
      new LineWrapper(line),
      { x: b.xCenter, y: b.yCenter },
    );
    setValues(bn, BaseNumbering.recommendedDefaults);
    bn.reposition();
    b.numbering = bn;
  } else {
    console.error('Unable to retrieve root SVG element of base.');
  }
}

export function removeNumbering(b: Base) {
  if (b.numbering) {
    b.numbering.text.remove();
    b.numbering.line.remove();
    b.numbering = undefined;
  }
}
