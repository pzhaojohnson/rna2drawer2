import { AnnotatingModeInterface as AnnotatingMode } from './AnnotatingModeInterface';
import highlightBase from '../highlight/highlightBase';
import { pulsateBetween } from 'Draw/interact/highlight/pulse';

export function setAllBaseHighlightings(mode: AnnotatingMode) {
  let bHovered = typeof mode.hovered == 'number' ? mode.drawing.getBaseAtOverallPosition(mode.hovered) : undefined;
  mode.drawing.forEachBase((b, p) => {
    if (mode.selected.has(p) || p == mode.hovered) {
      let radius = 1.15 * b.fontSize;
      if (b.outline) {
        let outlineRadius = b.outline.circle.attr('r');
        let outlineStrokeWidth = b.outline.circle.attr('stroke-width');
        if (typeof outlineRadius == 'number' && typeof outlineStrokeWidth == 'number') {
          radius = Math.max(radius, 1.25 * (outlineRadius + outlineStrokeWidth));
        }
      }
      let stroke = p == mode.hovered ? '#000000': '#808080';
      let justClickedOnAndSelected = p == mode.hovered && p == mode.selectingFrom;
      if (!b.highlighting || b.highlighting.circle.attr('stroke') != stroke || justClickedOnAndSelected) {
        if (b.highlighting) {
          if (b.highlighting.circle.attr('stroke') != stroke || justClickedOnAndSelected) {
            // seems impossible to edit an animated SVG element
            b.removeHighlighting();
          }
        }
        let h = highlightBase(b, {
          radius: radius,
          fill: 'none',
          stroke: stroke,
          strokeWidth: 0.75,
          strokeOpacity: p == mode.hovered ? 0.9 : 0.4,
        });
        if (h) {
          pulsateBetween(h, {
            radius: 1.1 * radius,
            strokeOpacity: p == mode.hovered ? 0.9 : 0.3,
          }, { duration: p == mode.hovered ? 625 : 2000 });
        }
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
