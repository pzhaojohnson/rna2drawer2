import { PivotingModeInterface as PivotingMode } from './PivotingModeInterface';
import { positionsOfStem } from '../highlight/positionsOfStem';
import { highlightBase } from '../highlight/highlightBase';
import { BaseInterface as Base } from '../../BaseInterface';

export interface Stem {
  position5: number;
  position3: number;
  size: number;
}

export function highlightStem(mode: PivotingMode, st: Stem) {
  let drawing = mode.strictDrawing.drawing;
  let bHovered = undefined as Base | undefined;
  if (typeof mode.hoveredPosition == 'number') {
    bHovered = drawing.getBaseAtOverallPosition(mode.hoveredPosition);
  }
  positionsOfStem(st).forEach(p => {
    let b = drawing.getBaseAtOverallPosition(p);
    if (b) {
      let radius = 0.85 * b.fontSize;
      if (b.outline) {
        radius = Math.max(radius, 1.15 * (b.outline.radius + b.outline.strokeWidth));
      }
      if (!b.highlighting) {
        let h = highlightBase(b, {
          radius: radius,
          fill: 'none',
          stroke: '#00bfff',
          strokeWidth: 1.5,
          strokeOpacity: 0.85,
        });
        h.pulsateBetween({
          radius: 1.5 * radius,
          strokeOpacity: 0.425,
        }, { duration: 1000 });
      }
      if (b.highlighting && bHovered && b.distanceBetweenCenters(bHovered) < 5 * radius) {
        b.highlighting.sendToBack();
      }
    }
  });
}
