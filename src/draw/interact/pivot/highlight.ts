import { PivotingModeInterface as PivotingMode } from './PivotingModeInterface';
import { positionsOfStem } from '../highlight/positionsOfStem';
import { highlightBase } from '../highlight/highlightBase';

export interface Stem {
  position5: number;
  position3: number;
  size: number;
}

export function highlightStem(mode: PivotingMode, st: Stem) {
  let drawing = mode.strictDrawing.drawing;
  positionsOfStem(st).forEach(p => {
    let b = drawing.getBaseAtOverallPosition(p);
    if (b && !b.highlighting) {
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
