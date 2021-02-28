import { TriangularizingModeInterface as TriangularizingMode } from "./TriangularizingModeInterface";
import { outerStemOfHoveredLoop } from './structure';
import { positionsOfStem } from '../highlight/positionsOfStem';
import { positionsOfLoop, positionsOfOutermostLoop } from './structure';
import { highlightBase } from '../highlight/highlightBase';

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
}
