import { AnnotatingModeInterface as AnnotatingMode } from './AnnotatingModeInterface';
import highlightBase from '../highlight/highlightBase';

export function setAllBaseHighlightings(mode: AnnotatingMode) {
  mode.drawing.forEachBase((b, p) => {
    if (mode.selected.has(p) || p == mode.hovered) {
      let h = highlightBase(b, {
        radius: 1.35 * b.fontSize,
        fillOpacity: 0,
        stroke: '#000000',
        strokeWidth: 1.25,
        strokeOpacity: 0.1,
      });
      h.pulsateBetween({
        radius: 1.65 * b.fontSize,
        strokeOpacity: 0.075,
      });
    } else {
      b.removeHighlighting();
    }
  });
}

export default setAllBaseHighlightings;
