import { PivotingModeInterface as PivotingMode } from './PivotingModeInterface';
import highlightBase from '../highlight/highlightBase';

export interface Stem {
  position5: number;
  position3: number;
  size: number;
}

function _stemPositions(st: Stem): Set<number> {
  let ps = new Set<number>();
  for (let i = 0; i < st.size; i++) {
    ps.add(st.position5 + i);
    ps.add(st.position3 - i);
  }
  return ps;
}

export function highlightStem(mode: PivotingMode, st: Stem) {
  let ps = _stemPositions(st);
  mode.strictDrawing.drawing.forEachBase((b, p) => {
    if (ps.has(p)) {
      let radius = 0.85 * b.fontSize;
      if (b.outline) {
        radius = Math.max(radius, 1.15 * (b.outline.radius + b.outline.strokeWidth));
      }
      let h = highlightBase(b, {
        radius: radius,
        fillOpacity: 0,
        stroke: '#00bfff',
        strokeWidth: 1.5,
        strokeOpacity: 0.75,
      });
      h.pulsateBetween({
        radius: 1.25 * radius,
        strokeOpacity: 0.5,
      }, { duration: 1000 });
    } else {
      b.removeHighlighting();
    }
  });
}

export default highlightStem;
