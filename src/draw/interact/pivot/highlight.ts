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
        h?.pulsateBetween({
          radius: 1.1875 * radius,
        }, { duration: 625 });
      }
      if (b.highlighting && bHovered && b.distanceBetweenCenters(bHovered) < 5 * radius) {
        b.highlighting.sendToBack();
      }
    }
  });
}
