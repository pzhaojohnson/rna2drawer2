import { DrawingElementInterface as DrawingElement } from './DrawingElementInterface';

import { Base } from 'Draw/bases/Base';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

import { StraightBondInterface as StraightBond } from 'Draw/bonds/straight/StraightBondInterface';
import { straightBondIsInvisible } from './straightBondIsInvisible';

import { interpretNumber } from 'Draw/svg/interpretNumber';

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
}

// returns a new box with the same center coordinates as the given box
// but with longer width and height (obtained by adding the given length
// to both the width and height)
function expand(box: Box, length: number): Box {
  return {
    x: box.x - (length / 2),
    y: box.y - (length / 2),
    width: box.width + length,
    height: box.height + length,
  };
}

function highlightingBoxOfBase(b: Base): Box {
  let textBBox = b.text.bbox();

  if (!b.outline) {
    return expand(textBBox, 6);
  }

  let box: Box = textBBox.merge(b.outline.circle.bbox());
  let sw = interpretNumber(b.outline.circle.attr('stroke-width'));
  if (sw) {
    box = expand(box, sw.convert('px').valueOf());
  }
  return expand(box, 1);
}

function highlightingBoxOfStraightBond(sb: StraightBond): Box {
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

  let box: Box = sb.line.bbox();
  let sw = interpretNumber(sb.line.attr('stroke-width'));
  if (sw) {
    box = expand(box, sw.convert('px').valueOf());
  }
  return box;
}

function highlightingBoxOfTertiaryBond(tb: TertiaryBond): Box {
  let box: Box = tb.path.bbox();
  let sw = interpretNumber(tb.path.attr('stroke-width'));
  if (sw) {
    box = expand(box, sw.convert('px').valueOf());
  }
  return box;
}

// Returns the box to be encompassed by the highlighting rect element
// for the given element.
//
// Returns undefined for an unrecognized element type.
export function highlightingBox(ele: DrawingElement): Box | undefined {
  if (ele instanceof Base) {
    return highlightingBoxOfBase(ele);
  } else if (ele instanceof PrimaryBond) {
    return highlightingBoxOfStraightBond(ele);
  } else if (ele instanceof SecondaryBond) {
    return highlightingBoxOfStraightBond(ele);
  } else if (ele instanceof TertiaryBond) {
    return highlightingBoxOfTertiaryBond(ele);
  } else {
    return undefined;
  }
}
