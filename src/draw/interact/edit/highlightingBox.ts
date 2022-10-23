import * as SVG from '@svgdotjs/svg.js';

import { DrawingElementInterface as DrawingElement } from './DrawingElementInterface';

import { Base } from 'Draw/bases/Base';
import { BaseNumbering } from 'Draw/bases/numberings/BaseNumbering';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

import type { StrungElement } from 'Draw/bonds/strung/StrungElement';

import { interpretNumericValue } from 'Draw/svg/interpretNumericValue';

import { bboxOfCircle } from 'Draw/svg/bboxOfCircle';
import { bboxOfLine } from 'Draw/svg/bboxOfLine';

import type { StraightBond } from 'Draw/bonds/straight/StraightBond';
import { basePaddingsOverlap } from 'Draw/bonds/straight/basePaddingsOverlap';

import type { Point2D as Point } from 'Math/points/Point';

/**
 * Creates a new box using the two provided points as diagonal corners.
 */
function createBox(args: (
  { point1: Point, point2: Point }
)): SVG.Box
{
  let point1 = args.point1;
  let point2 = args.point2;
  return new SVG.Box(
    Math.min(point1.x, point2.x),
    Math.min(point1.y, point2.y),
    Math.abs(point1.x - point2.x),
    Math.abs(point1.y - point2.y),
  );
}

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

function highlightingBoxOfStrungElement(
  strungElement: StrungElement,
): SVG.Box
{
  if (strungElement.type == 'StrungText') {
    return highlightingBoxOfSVGText(strungElement.text);
  } else if (strungElement.type == 'StrungCircle') {
    return highlightingBoxOfSVGCircle(strungElement.circle);
  } else {
    return highlightingBoxOfSVGPath(strungElement.path);
  }
}

function highlightingBoxOfStraightBond(sb: StraightBond): SVG.Box {
  let box: SVG.Box;

  if (basePaddingsOverlap(sb)) {
    let bc1 = sb.base1.center();
    let bc2 = sb.base2.center();
    box = createBox({ point1: bc1, point2: bc2 });
  } else {
    box = highlightingBoxOfSVGLine(sb.line);
  }

  sb.strungElements.forEach(strungElement => {
    box = box.merge(highlightingBoxOfStrungElement(strungElement));
  });

  return box;
}

function highlightingBoxOfTertiaryBond(tb: TertiaryBond): SVG.Box {
  let box = highlightingBoxOfSVGPath(tb.path);

  tb.strungElements.forEach(strungElement => {
    box = box.merge(highlightingBoxOfStrungElement(strungElement));
  });

  return box;
}

// Returns the box to be encompassed by the highlighting rect element
// for the given element.
//
// Returns undefined for an unrecognized element type.
export function highlightingBox(ele: DrawingElement): SVG.Box | undefined {
  let box = ele instanceof Base ? (
    highlightingBoxOfBase(ele)
  ) : ele instanceof BaseNumbering ? (
    highlightingBoxOfBaseNumbering(ele)
  ) : ele instanceof PrimaryBond ? (
    highlightingBoxOfStraightBond(ele)
  ) : ele instanceof SecondaryBond ? (
    highlightingBoxOfStraightBond(ele)
  ) : ele instanceof TertiaryBond ? (
    highlightingBoxOfTertiaryBond(ele)
  ) : (
    undefined
  );

  // ensure width and height are at least 2
  // (to prevent the highlighting box from being invisible)
  if (box && box.width < 2) {
    box = new SVG.Box(box.cx - 1, box.y, 2, box.height);
  }
  if (box && box.height < 2) {
    box = new SVG.Box(box.x, box.cy - 1, box.width, 2);
  }

  return box;
}
