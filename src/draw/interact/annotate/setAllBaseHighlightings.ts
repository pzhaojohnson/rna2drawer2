import { AnnotatingModeInterface as AnnotatingMode } from './AnnotatingModeInterface';
import highlightBase from '../highlight/highlightBase';

export function setAllBaseHighlightings(mode: AnnotatingMode) {
  let bHovered = typeof mode.hovered == 'number' ? mode.drawing.getBaseAtOverallPosition(mode.hovered) : undefined;
  mode.drawing.forEachBase((b, p) => {
    if (mode.selected.has(p) || p == mode.hovered) {
      let radius = 1.25 * b.fontSize;
      if (b.outline) {
        radius = Math.max(radius, 1.25 * b.outline.radius);
      }
      let stroke = p == mode.hovered ? '#404040': '#808080';
      if (!b.highlighting || b.highlighting.stroke != stroke) {
        let h = highlightBase(b, {
          radius: radius,
          fill: 'none',
          stroke: stroke,
          strokeWidth: 1.25,
          strokeOpacity: 0.75,
        });
        h.pulsateBetween({
          radius: 1.25 * radius,
          strokeOpacity: 0.1,
        }, { duration: 1500 });
      }
      // if close to hovered base
      if (b.highlighting && bHovered && b.distanceBetweenCenters(bHovered) < 5 * radius) {
        b.highlighting.sendToBack();
      }
    } else {
      b.removeHighlighting();
    }
  });
}

export default setAllBaseHighlightings;
