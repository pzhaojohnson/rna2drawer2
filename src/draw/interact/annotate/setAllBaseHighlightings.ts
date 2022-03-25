import { AnnotatingModeInterface as AnnotatingMode } from './AnnotatingModeInterface';
import highlightBase from '../highlight/highlightBase';
import { pulsateBetween } from 'Draw/interact/highlight/pulse';
import { removeCircleHighlighting } from 'Draw/bases/annotate/circle/add';
import type { Base } from 'Draw/bases/Base';
import { isPoint2D as isPoint } from 'Math/points/Point';
import { distance2D as distance } from 'Math/distance';
import {
  sendToBack as sendHighlightingToBack,
} from 'Draw/bases/annotate/circle/z';

function areWithin(b1: Base, b2: Base, radius: number): boolean {
  // faster to use x and y coordinates than to retrieve center coordinates
  let p1 = { x: b1.text.attr('x'), y: b1.text.attr('y') };
  let p2 = { x: b2.text.attr('x'), y: b2.text.attr('y') };
  if (isPoint(p1) && isPoint(p2)) {
    return distance(p1.x, p1.y, p2.x, p2.y) <= radius;
  }
  return false;
}

export function setAllBaseHighlightings(mode: AnnotatingMode) {
  let bHovered = mode.strictDrawing.drawing.getBaseAtOverallPosition(mode.hovered ?? 0);
  mode.strictDrawing.drawing.forEachBase((b, p) => {
    if (mode.selected.has(p) || p == mode.hovered) {
      let fs = b.text.attr('font-size');
      let radius = 1.15 * (typeof fs == 'number' ? fs : 9);
      if (b.outline) {
        let outlineRadius = b.outline.circle.attr('r');
        let outlineStrokeWidth = b.outline.circle.attr('stroke-width');
        if (typeof outlineRadius == 'number' && typeof outlineStrokeWidth == 'number') {
          radius = Math.max(radius, 1.25 * (outlineRadius + outlineStrokeWidth));
        }
      }
      let stroke = p == mode.hovered ? '#000000': '#808080';
      let justClickedOnAndSelected = p == mode.hovered && p == mode.selectingFrom;
      if (!b.highlighting || b.highlighting.circle.attr('stroke') != stroke || justClickedOnAndSelected) {
        if (b.highlighting) {
          if (b.highlighting.circle.attr('stroke') != stroke || justClickedOnAndSelected) {
            // seems impossible to edit an animated SVG element
            removeCircleHighlighting(b);
          }
        }
        let h = highlightBase(b, {
          radius: radius,
          fill: 'none',
          stroke: stroke,
          strokeWidth: 0.75,
          strokeOpacity: p == mode.hovered ? 0.9 : 0.4,
        });
        if (h) {
          pulsateBetween(h, {
            radius: 1.1 * radius,
            strokeOpacity: p == mode.hovered ? 0.9 : 0.3,
          }, { duration: p == mode.hovered ? 625 : 2000 });
        }
      }
      // if close to hovered base
      if (b.highlighting && bHovered && areWithin(b, bHovered, 5 * radius)) {
        sendHighlightingToBack(b.highlighting);
      }
    } else {
      removeCircleHighlighting(b);
    }
  });
}

export default setAllBaseHighlightings;
