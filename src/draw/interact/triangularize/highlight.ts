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
  let ps = positionsToHighlight(mode);
  if (ps) {
    let drawing = mode.strictDrawing.drawing;
    ps.forEach(p => {
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
}
