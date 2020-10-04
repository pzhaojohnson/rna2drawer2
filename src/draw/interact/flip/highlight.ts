import { FlippingModeInterface as FlippingMode } from './FlippingModeInterface';
import { positionsOfStem, Stem } from '../highlight/positionsOfStem';
import { highlightBase } from '../highlight/highlightBase';

export function highlightStem(mode: FlippingMode, st: Stem) {
  let drawing = mode.strictDrawing.drawing;
  positionsOfStem(st).forEach(p => {
    let b = drawing.getBaseAtOverallPosition(p);
    if (b) {
      let radius = 0.85 * b.fontSize;
      if (b.outline) {
        radius = Math.max(radius, 1.15 * (b.outline.radius + b.outline.strokeWidth));
      }
      let h = highlightBase(b, {
        radius: radius,
        fill: '#00bfff',
        fillOpacity: 0.15,
        stroke: '#00bfff',
        strokeWidth: 1.5,
        strokeOpacity: 0.85,
      });
      h.pulsateBetween({
        radius: 1.25 * radius,
        fillOpacity: 0.075,
        strokeOpacity: 0.425,
      }, { duration: 750 });
    }
  });
}
