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
  h.circle.attr({ 'r': props?.radius ?? h.circle.attr('r') });
  h.stroke = props?.stroke ?? h.stroke;
  h.strokeWidth = props?.strokeWidth ?? h.strokeWidth;
  h.strokeOpacity = props?.strokeOpacity ?? h.strokeOpacity;
  h.strokeDasharray = props?.strokeDasharray ?? h.strokeDasharray;
  h.fill = props?.fill ?? h.fill;
  h.fillOpacity = props?.fillOpacity ?? h.fillOpacity;
  return h;
}

export default highlightBase;
