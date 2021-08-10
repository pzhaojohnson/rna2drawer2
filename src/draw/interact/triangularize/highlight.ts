import { TriangularizingModeInterface as TriangularizingMode } from "./TriangularizingModeInterface";
import { outerStemOfHoveredLoop } from './structure';
import { positionsOfStem } from '../highlight/positionsOfStem';
import { positionsOfLoop, positionsOfOutermostLoop } from './structure';
import { highlightBase } from '../highlight/highlightBase';
import { pulsateBetween } from 'Draw/interact/highlight/pulse';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
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

function positionsToHighlight(mode: TriangularizingMode): number[] | undefined {
  if (typeof mode.hovered == 'number') {
    let partners = mode.strictDrawing.layoutPartners();
    let ost = outerStemOfHoveredLoop(mode);
    if (ost) {
      let ps = positionsOfStem(ost);
      return ps.concat(positionsOfLoop(partners, ost));
    } else {
      return positionsOfOutermostLoop(partners);
    }
  }
}

export function highlightHovered(mode: TriangularizingMode) {
  let drawing = mode.strictDrawing.drawing;
  let bHovered = typeof mode.hovered == 'number' ? drawing.getBaseAtOverallPosition(mode.hovered) : undefined;
  let ps = positionsToHighlight(mode);
  if (ps) {
    ps.forEach(p => {
      let b = drawing.getBaseAtOverallPosition(p);
      if (b) {
        let fs = b.text.attr('font-size');
        let radius = typeof fs == 'number' ? fs : 9;
        if (b.outline) {
          let outlineRadius = b.outline.circle.attr('r');
          let outlineStrokeWidth = b.outline.circle.attr('stroke-width');
          if (typeof outlineRadius == 'number' && typeof outlineStrokeWidth == 'number') {
            radius = Math.max(radius, 1.25 * (outlineRadius + outlineStrokeWidth));
          }
        }
        if (!b.highlighting) {
          let h = highlightBase(b, {
            radius: radius,
            fill: 'none',
            stroke: '#000000',
            strokeWidth: 0.9,
            strokeOpacity: 0.9,
            strokeDasharray: '3,1.5',
          });
          if (h) {
            pulsateBetween(h, {
              radius: 1.1875 * radius,
            }, { duration: 675 });
          }
        }
        if (b.highlighting && bHovered && areWithin(b, bHovered, 5 * radius)) {
          sendHighlightingToBack(b.highlighting);
        }
      }
    });
  }
}
