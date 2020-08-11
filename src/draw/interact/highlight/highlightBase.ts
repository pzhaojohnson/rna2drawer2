import { BaseInterface as Base } from '../../BaseInterface';
import { CircleBaseAnnotationInterface as CircleBaseAnnotation } from '../../BaseAnnotationInterface';

export interface HighlightingProps {
  radius?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  fill?: string;
  fillOpacity?: number;
}

export function highlightBase(b: Base, props?: HighlightingProps): CircleBaseAnnotation {
  let h = b.highlighting;
  if (!h) {
    h = b.addCircleHighlighting();
    h.back();
  }
  h.radius = props?.radius ?? h.radius;
  h.stroke = props?.stroke ?? h.stroke;
  h.strokeWidth = props?.strokeWidth ?? h.strokeWidth;
  h.strokeOpacity = props?.strokeOpacity ?? h.strokeOpacity;
  h.fill = props?.fill ?? h.fill;
  h.fillOpacity = props?.fillOpacity ?? h.fillOpacity;
  return h;
}

export default highlightBase;
