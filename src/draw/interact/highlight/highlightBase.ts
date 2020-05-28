import Base from '../../Base';

export interface HighlightingProps {
  radius?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  fill?: string;
  fillOpacity?: number;
}

export function highlightBase(b: Base, props: HighlightingProps) {
  let h = b.addCircleHighlighting();
  h.radius = props.radius ?? 1.25 * b.fontSize;
  h.stroke = props.stroke ?? '#000000';
  h.strokeWidth = props.strokeWidth ?? 0;
  h.strokeOpacity = props.strokeOpacity ?? 1;
  h.fill = props.fill ?? '#ffd700';
  h.fillOpacity = props.fillOpacity ?? 0.75;
}

export default highlightBase;
