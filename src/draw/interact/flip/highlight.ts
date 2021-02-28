import { FlippingModeInterface as FlippingMode } from './FlippingModeInterface';
import { positionsOfStem, Stem } from '../highlight/positionsOfStem';
import { highlightBase } from '../highlight/highlightBase';

export function highlightStem(mode: FlippingMode, st: Stem) {
  let drawing = mode.strictDrawing.drawing;
  let bHovered = typeof mode.hovered == 'number' ? drawing.getBaseAtOverallPosition(mode.hovered) : undefined;
  positionsOfStem(st).forEach(p => {
    let b = drawing.getBaseAtOverallPosition(p);
    if (b) {
      let radius = b.fontSize;
      if (b.outline) {
        radius = Math.max(radius, 1.25 * (b.outline.radius + b.outline.strokeWidth));
      }
      let h = highlightBase(b, {
        radius: radius,
        fill: 'none',
        stroke: '#000000',
        strokeWidth: 0.825,
        strokeOpacity: 0.875,
        strokeDasharray: '3,1.5',
      });
      h.pulsateBetween({
        radius: 1.25 * radius,
      }, { duration: 675 });
      if (bHovered && b.distanceBetweenCenters(bHovered) < 5 * radius) {
        h.sendToBack();
      }
    }
  });
}
