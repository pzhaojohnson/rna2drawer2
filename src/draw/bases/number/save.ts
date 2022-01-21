import { BaseNumberingInterface } from './BaseNumberingInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import * as SVG from '@svgdotjs/svg.js';
import { SVGTextWrapper as TextWrapper } from 'Draw/svg/SVGTextWrapper';
import { SVGLineWrapper as LineWrapper } from 'Draw/svg/SVGLineWrapper';
import { findTextByUniqueId, findLineByUniqueId } from 'Draw/saved/svg';
import { BaseNumbering } from './BaseNumbering';
import { values } from './values';

export type SavableState = {
  className: 'BaseNumbering';
  textId: string;
  lineId: string;
}

export function savableState(bn: BaseNumberingInterface): SavableState {
  return {
    className: 'BaseNumbering',
    textId: String(bn.text.id()),
    lineId: String(bn.line.id()),
  };
}

export type SavedState = { [key: string]: unknown }

export function addSavedNumbering(b: Base, saved: SavedState): void | never {
  if (saved.className != 'BaseNumbering') {
    throw new Error('Saved state is not for a base numbering.');
  }
  let svg = b.text.root();
  if (!(svg instanceof SVG.Svg)) {
    throw new Error('Unable to retrieve root SVG element of base.');
  } else {
    let text = findTextByUniqueId(svg, saved.textId);
    let line = findLineByUniqueId(svg, saved.lineId);
    let bn = new BaseNumbering(
      new TextWrapper(text),
      new LineWrapper(line),
      { x: b.xCenter, y: b.yCenter },
    );
    if (b.numbering) {
      throw new Error('Base already has numbering.');
    }
    b.numbering = bn;
    BaseNumbering.recommendedDefaults = values(bn);
  }
}
