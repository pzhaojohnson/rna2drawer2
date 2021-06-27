import { BaseInterface as Base } from '../../BaseInterface';
import { CircleBaseAnnotationInterface as CircleBaseAnnotation } from 'Draw/bases/annotate/circle/CircleBaseAnnotationInterface';

export interface HighlightingProps {
  radius?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  strokeDasharray?: string;
  fill?: string;
  fillOpacity?: number;
}

export function highlightBase(b: Base, props?: HighlightingProps): CircleBaseAnnotation | undefined {
  let h = b.highlighting;
  if (!h) {
    h = b.addCircleHighlighting();
  }
  if (h) {
    h.circle.attr({
      'r': props?.radius ?? h.circle.attr('r'),
      'stroke': props?.stroke ?? h.circle.attr('stroke'),
      'stroke-width': props?.strokeWidth ?? h.circle.attr('stroke-width'),
      'stroke-opacity': props?.strokeOpacity ?? h.circle.attr('stroke-opacity'),
      'stroke-dasharray': props?.strokeDasharray ?? h.circle.attr('stroke-dasharray'),
      'fill': props?.fill ?? h.circle.attr('fill'),
      'fill-opacity': props?.fillOpacity ?? h.circle.attr('fill-opacity'),
    });
    return h;
  }
}

export default highlightBase;
