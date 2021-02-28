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
      let radius = b.fontSize;
      if (b.outline) {
        radius = Math.max(radius, 1.25 * (b.outline.radius + b.outline.strokeWidth));
      }
      if (!b.highlighting) {
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
      }
      if (b.highlighting && bHovered && b.distanceBetweenCenters(bHovered) < 5 * radius) {
        b.highlighting.sendToBack();
      }
    }
  });
}
