import * as SVG from '@svgdotjs/svg.js';
import { interpretNumericValue } from 'Draw/svg/interpretNumericValue';

/**
 * Calculates the bounding box of a circle more precisely
 * than the built-in bbox method, which does not seem
 * to account for the stroke-width attribute.
 */
export function bboxOfCircle(circle: SVG.Circle): SVG.Box {
  let cx = interpretNumericValue(circle.attr('cx'))?.valueOf();
  let cy = interpretNumericValue(circle.attr('cy'))?.valueOf();
  let r = interpretNumericValue(circle.attr('r'))?.valueOf();
  let strokeWidth = interpretNumericValue(circle.attr('stroke-width'))?.valueOf();

  // if any values could not be interpreted
  if (
    cx == undefined
    || cy == undefined
    || r == undefined
    || strokeWidth == undefined
  ) {
    return circle.bbox(); // just use the built-in bbox method
  }

  let diameter = 2 * r;
  diameter += strokeWidth; // account for stroke-width

  return new SVG.Box(
    cx - (diameter / 2),
    cy - (diameter / 2),
    diameter,
    diameter,
  );
}
