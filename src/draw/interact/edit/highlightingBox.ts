import * as SVG from '@svgdotjs/svg.js';

import { DrawingElementInterface as DrawingElement } from './DrawingElementInterface';

import { Base } from 'Draw/bases/Base';
import { BaseNumbering } from 'Draw/bases/numberings/BaseNumbering';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

import { interpretNumericValue } from 'Draw/svg/interpretNumericValue';

import { bboxOfCircle } from 'Draw/svg/bboxOfCircle';
import { bboxOfLine } from 'Draw/svg/bboxOfLine';

import type { StraightBond } from 'Draw/bonds/straight/StraightBond';
import { isInvisible as straightBondIsInvisible } from 'Draw/bonds/straight/isInvisible';

/**
 * Returns a new box whose width has been scaled by the provided factor
 * and whose center coordinates remain the same as the provided box.
 */
 function scaleBoxX(box: SVG.Box, factor: number): SVG.Box {
  let width = factor * box.width;
  return new SVG.Box(
    box.cx - (width / 2),
    box.y,
    width,
    box.height,
  );
}

/**
 * Returns a new box whose height has been scaled by the provided factor
 * and whose center coordinates remain the same as the provided box.
 */
 function scaleBoxY(box: SVG.Box, factor: number): SVG.Box {
  let height = factor * box.height;
  return new SVG.Box(
    box.x,
    box.cy - (height / 2),
    box.width,
    height,
  );
}

/**
 * Returns a new box whose width and height have been scaled by the
 * provided factor and whose center coordinates remain the same as the
 * provided box.
 */
function scaleBox(box: SVG.Box, factor: number): SVG.Box {
  box = scaleBoxX(box, factor);
  return scaleBoxY(box, factor);
}

function highlightingBoxOfSVGText(text: SVG.Text): SVG.Box {
  let box = text.bbox();
  // two pixels of padding on each side
  box = scaleBoxX(box, 1 + (4 / box.width));
  return scaleBoxY(box, 1 + (4 / box.height));
}

function highlightingBoxOfSVGLine(line: SVG.Line): SVG.Box {
  return bboxOfLine(line);
}

function highlightingBoxOfSVGCircle(circle: SVG.Circle): SVG.Box {
  let box = bboxOfCircle(circle);
  // half a pixel of padding on each side
  let factor = 1 + (1 / box.width);
  return scaleBox(box, factor);
}

function highlightingBoxOfSVGPath(path: SVG.Path): SVG.Box {
  let box = path.bbox();

  let sw = interpretNumericValue(path.attr('stroke-width'))?.valueOf();
  if (typeof sw == 'number') {
    box = scaleBoxX(box, 1 + (sw / box.width));
    box = scaleBoxY(box, 1 + (sw / box.height));
  }

  return box;
}

function highlightingBoxOfBase(b: Base): SVG.Box {
  let box = highlightingBoxOfSVGText(b.text);

  if (b.outline) {
    box = box.merge(highlightingBoxOfSVGCircle(b.outline.circle));
  }

  return box;
}

function highlightingBoxOfBaseNumbering(bn: BaseNumbering): SVG.Box {
  let box = highlightingBoxOfSVGText(bn.text);
  return box.merge(highlightingBoxOfSVGLine(bn.line));
}

function highlightingBoxOfStraightBond(sb: StraightBond): SVG.Box {
  if (straightBondIsInvisible(sb)) {
    let bc1 = sb.base1.center();
    let bc2 = sb.base2.center();
    return new SVG.Box(
      Math.min(bc1.x, bc2.x),
      Math.min(bc1.y, bc2.y),
      Math.abs(bc1.x - bc2.x),
      Math.abs(bc1.y - bc2.y),
    );
  }

  return highlightingBoxOfSVGLine(sb.line);
}

function highlightingBoxOfTertiaryBond(tb: TertiaryBond): SVG.Box {
  return highlightingBoxOfSVGPath(tb.path);
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
