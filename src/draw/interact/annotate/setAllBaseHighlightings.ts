import { AnnotatingModeInterface as AnnotatingMode } from './AnnotatingModeInterface';
import highlightBase from '../highlight/highlightBase';

export function setAllBaseHighlightings(mode: AnnotatingMode) {
  mode.drawing.forEachBase((b, p) => {
    if (mode.selected.has(p) || p == mode.hovered) {
      let stroke = p == mode.hovered ? '#000000': '#404040';
      if (!b.highlighting || b.highlighting.stroke != stroke) {
        let radius = 1.5 * b.fontSize;
        if (b.outline) {
          radius = Math.max(radius, 1.15 * b.outline.radius);
        }
        let h = highlightBase(b, {
          radius: radius,
          fillOpacity: 0,
          stroke: stroke,
          strokeWidth: 1.25,
          strokeOpacity: 0.125,
        });
        h.pulsateBetween({
          radius: 1.15 * radius,
          strokeOpacity: 0.0625,
        }, { duration: 2000 });
      }
    } else {
      b.removeHighlighting();
    }
  });
}

export default setAllBaseHighlightings;
