import * as SVG from '@svgdotjs/svg.js';

import { DrawingElementInterface as DrawingElement } from './DrawingElementInterface';

import { Base } from 'Draw/bases/Base';
import { BaseNumbering } from 'Draw/bases/numberings/BaseNumbering';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

import { interpretNumber } from 'Draw/svg/interpretNumber';

import { bboxOfCircle } from 'Draw/svg/bboxOfCircle';
import { bboxOfLine } from 'Draw/svg/bboxOfLine';

import type { StraightBond } from 'Draw/bonds/straight/StraightBond';
import { isInvisible as straightBondIsInvisible } from 'Draw/bonds/straight/isInvisible';

// returns a new box with the same center coordinates as the given box
// but with longer width and height (obtained by adding the given length
// to both the width and height)
function expand(box: SVG.Box, length: number): SVG.Box {
  return new SVG.Box(
    box.x - (length / 2),
    box.y - (length / 2),
    box.width + length,
    box.height + length,
  );
}

// returns a new box that is the bounding box of both boxes
function merge(box1: SVG.Box, box2: SVG.Box): SVG.Box {
  let x = Math.min(box1.x, box2.x);
  let y = Math.min(box1.y, box2.y);
  return new SVG.Box(
    x,
    y,
    Math.max(box1.x + box1.width, box2.x + box2.width) - x,
    Math.max(box1.y + box1.height, box2.y + box2.height) - y,
  );
}

function highlightingBoxOfBase(b: Base): SVG.Box {
  let textBBox = b.text.bbox();

  if (!b.outline) {
    return expand(textBBox, 6);
  }

  let box = textBBox.merge(bboxOfCircle(b.outline.circle));

  return expand(box, 1);
}

function highlightingBoxOfBaseNumbering(bn: BaseNumbering): SVG.Box {
  let textBox = bn.text.bbox();
  textBox = expand(textBox, 4);

  let lineBox = bboxOfLine(bn.line);

  return merge(textBox, lineBox);
}

function highlightingBoxOfStraightBond(sb: StraightBond): SVG.Box {
  if (straightBondIsInvisible(sb)) {
    let bc1 = { x: sb.base1.xCenter, y: sb.base1.yCenter };
    let bc2 = { x: sb.base2.xCenter, y: sb.base2.yCenter };
    return new SVG.Box(
      Math.min(bc1.x, bc2.x),
      Math.min(bc1.y, bc2.y),
      Math.abs(bc1.x - bc2.x),
      Math.abs(bc1.y - bc2.y),
    );
  }

  return bboxOfLine(sb.line);
}

function highlightingBoxOfTertiaryBond(tb: TertiaryBond): SVG.Box {
  let box = tb.path.bbox();
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
export function highlightingBox(ele: DrawingElement): SVG.Box | undefined {
  if (ele instanceof Base) {
    return highlightingBoxOfBase(ele);
  } else if (ele instanceof BaseNumbering) {
    return highlightingBoxOfBaseNumbering(ele);
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
