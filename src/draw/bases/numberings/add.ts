import type { Base } from 'Draw/bases/Base';
import * as SVG from '@svgdotjs/svg.js';
import { BaseNumbering } from 'Draw/bases/numberings/BaseNumbering';
import { setValues } from 'Draw/bases/numberings/values';

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
  if (!(svg instanceof SVG.Svg)) {
    console.error('Unable to retrieve root SVG element of base.');
  } else {
    let text = addText(svg, n);
    let line = svg.line(0, 0, 1, 1);
    let bn = new BaseNumbering(
      text,
      line,
      { x: b.xCenter, y: b.yCenter },
    );
    setValues(bn, BaseNumbering.recommendedDefaults);
    bn.reposition();
    b.numbering = bn;
  }
}

export function removeNumbering(b: Base) {
  if (b.numbering) {
    b.numbering.text.remove();
    b.numbering.line.remove();
    b.numbering = undefined;
  }
}
