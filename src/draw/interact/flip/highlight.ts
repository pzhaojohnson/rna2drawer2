import { FlippingModeInterface as FlippingMode } from './FlippingModeInterface';
import { positionsOfStem, Stem } from '../highlight/positionsOfStem';
import { highlightBase } from '../highlight/highlightBase';
import { pulsateBetween } from 'Draw/interact/highlight/pulse';

export function highlightStem(mode: FlippingMode, st: Stem) {
  let drawing = mode.strictDrawing.drawing;
  let bHovered = typeof mode.hovered == 'number' ? drawing.getBaseAtOverallPosition(mode.hovered) : undefined;
  positionsOfStem(st).forEach(p => {
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
        }, { duration: 625 });
      }
      if (bHovered && b.distanceBetweenCenters(bHovered) < 5 * radius) {
        h?.sendToBack();
      }
    }
  });
}
