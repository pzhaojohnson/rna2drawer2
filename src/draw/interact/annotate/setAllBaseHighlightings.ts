import { AnnotatingModeInterface as AnnotatingMode } from './AnnotatingModeInterface';
import highlightBase from '../highlight/highlightBase';

export function setAllBaseHighlightings(mode: AnnotatingMode) {
  let bHovered = typeof mode.hovered == 'number' ? mode.drawing.getBaseAtOverallPosition(mode.hovered) : undefined;
  mode.drawing.forEachBase((b, p) => {
    if (mode.selected.has(p) || p == mode.hovered) {
      let radius = 1.15 * b.fontSize;
      if (b.outline) {
        radius = Math.max(radius, 1.25 * b.outline.radius);
      }
      let stroke = p == mode.hovered ? '#000000': '#808080';
      if (!b.highlighting || b.highlighting.stroke != stroke) {
        let h = highlightBase(b, {
          radius: radius,
          fill: 'none',
          stroke: stroke,
          strokeWidth: 0.75,
          strokeOpacity: p == mode.hovered ? 0.8 : 0.3,
        });
        h.pulsateBetween({
          radius: 1.125 * radius,
          strokeOpacity: p == mode.hovered ? 0.8 : 0.15,
        }, { duration: p == mode.hovered ? 750 : 1750 });
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
