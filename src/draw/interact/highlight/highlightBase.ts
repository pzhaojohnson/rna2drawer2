import { BaseInterface as Base } from '../../BaseInterface';
import { CircleBaseAnnotationInterface as CircleBaseAnnotation } from '../../BaseAnnotationInterface';

export interface HighlightingProps {
  radius?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  strokeDasharray?: string;
  fill?: string;
  fillOpacity?: number;
}

export function highlightBase(b: Base, props?: HighlightingProps): CircleBaseAnnotation {
  let h = b.highlighting;
  if (!h) {
    h = b.addCircleHighlighting();
  }
  h.circle.attr({
    'r': props?.radius ?? h.circle.attr('r'),
    'stroke': props?.stroke ?? h.circle.attr('stroke'),
    'fill': props?.fill ?? h.circle.attr('fill'),
    'fill-opacity': props?.fillOpacity ?? h.circle.attr('fill-opacity'),
  });
  h.strokeWidth = props?.strokeWidth ?? h.strokeWidth;
  h.strokeOpacity = props?.strokeOpacity ?? h.strokeOpacity;
  h.strokeDasharray = props?.strokeDasharray ?? h.strokeDasharray;
  return h;
}

export default highlightBase;
