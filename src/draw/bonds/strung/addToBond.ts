import * as SVG from '@svgdotjs/svg.js';

import type { StrungElement } from 'Draw/bonds/strung/StrungElement';

import { StraightBond } from 'Draw/bonds/straight/StraightBond';
import { QuadraticBezierBond } from 'Draw/bonds/curved/QuadraticBezierBond';

import { appendStrungElement as appendStrungElementToSvg } from 'Draw/bonds/strung/add';
import { removeStrungElement as removeStrungElementFromSvg } from 'Draw/bonds/strung/add';

export type Bond = StraightBond | QuadraticBezierBond;

export type AddToArgs = {
  /**
   * The bond to add the strung element to.
   */
  bond: Bond;

  /**
   * The strung element to add to the bond.
   */
  strungElement: StrungElement;

  /**
   * The index in the strung elements array of the bond to add the strung
   * element at.
   *
   * The strung element is appended to the end of the strung elements array of
   * the bond if left unspecified.
   */
  index?: number;
};

export function addStrungElementToBond(args: AddToArgs) {
  let bond = args.bond;
  let ele = args.strungElement;

  let i = args.index ?? bond.strungElements.length;
  // ensure is not negative
  i = Math.max(i, 0);
  // ensure that gaps will not be introduced into the strung elements array
  i = Math.min(i, bond.strungElements.length);

  bond.strungElements.splice(i, 0, ele);

  // use unknown type to require type checking
  let svg: unknown;
  if (bond instanceof StraightBond) {
    svg = bond.line.root();
  } else {
    svg = bond.path.root();
  }

  if (svg instanceof SVG.Svg) {
    appendStrungElementToSvg(svg, ele);
  }
}

export type RemoveFromArgs = {
  /**
   * The bond to remove the strung element from.
   */
  bond: Bond;

  /**
   * The strung element to remove.
   */
  strungElement: StrungElement;
};

/**
 * Has no effect if the given strung element is not in the strung elements
 * array of the bond.
 */
export function removeStrungElementFromBond(args: RemoveFromArgs) {
  let bond = args.bond;
  let ele = args.strungElement;

  let i = bond.strungElements.indexOf(ele);

  if (i < 0) {
    return; // strung element is not in the strung elements array of the bond
  }

  bond.strungElements.splice(i, 1);
  removeStrungElementFromSvg(ele);
}
