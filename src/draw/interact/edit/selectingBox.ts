import { DrawingElementInterface as DrawingElement } from './DrawingElementInterface';

import { Base } from 'Draw/bases/Base';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

import type { StraightBond } from 'Draw/bonds/straight/StraightBond';
import { isInvisible as straightBondIsInvisible } from 'Draw/bonds/straight/isInvisible';

export type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
}

function selectingBoxOfStraightBond(sb: StraightBond): Box {
  if (straightBondIsInvisible(sb)) {
    let bc1 = { x: sb.base1.xCenter, y: sb.base1.yCenter };
    let bc2 = { x: sb.base2.xCenter, y: sb.base2.yCenter };
    return {
      x: Math.min(bc1.x, bc2.x),
      y: Math.min(bc1.y, bc2.y),
      width: Math.abs(bc1.x - bc2.x),
      height: Math.abs(bc1.y - bc2.y),
    };
  }

  return sb.line.bbox();
}

// Returns the box that when encompassed (such as by a selecting rect element)
// should result in the given element being selected.
//
// Returns undefined for an unrecognized element type.
export function selectingBox(ele: DrawingElement): Box | undefined {
  if (ele instanceof Base) {
    return ele.text.bbox();
  } else if (ele instanceof BaseNumbering) {
    return ele.text.bbox();
  } else if (ele instanceof PrimaryBond) {
    return selectingBoxOfStraightBond(ele);
  } else if (ele instanceof SecondaryBond) {
    return selectingBoxOfStraightBond(ele);
  } else if (ele instanceof TertiaryBond) {
    return ele.path.bbox();
  } else {
    return undefined;
  }
}
