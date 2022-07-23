import type { Base } from 'Draw/bases/Base';

import { BaseNumbering } from 'Draw/bases/numberings/BaseNumbering';
import { setValues } from 'Draw/bases/numberings/values';

import * as SVG from '@svgdotjs/svg.js';

/**
 * Creates a text object with the given number in the provided
 * SVG document.
 */
function createTextForNumbering(svg: SVG.Svg, n: number): SVG.Text {
  // input an empty function instead of an empty string
  // in case an empty string results in an empty tspan
  // being added
  let text = svg.text(() => {});

  // doesn't add a tspan
  text.plain(n.toString());

  return text;
}

/**
 * Adds numbering to the base with the given number.
 *
 * (Removes any preexisting numbering that the base has if present.)
 */
export function addNumbering(b: Base, n: number) {
  removeNumbering(b); // remove any preexisting numbering

  let svg: SVG.Svg | null = b.text.root();

  if (!svg) {
    console.error('Unable to retrieve the SVG document that the base is in.');
    return;
  }

  let text = createTextForNumbering(svg, n);
  let line = svg.line(0, 0, 1, 1);
  let bn = new BaseNumbering(text, line, b.center());
  setValues(bn, BaseNumbering.recommendedDefaults);
  bn.reposition();
  b.numbering = bn;
}

/**
 * Removes any numbering that the base has if present.
 *
 * (Has no effect if the base has no numbering.)
 */
export function removeNumbering(b: Base) {
  if (b.numbering) {
    b.numbering.text.remove();
    b.numbering.line.remove();
    b.numbering = undefined;
  }
}
