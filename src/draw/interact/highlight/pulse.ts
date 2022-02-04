import { CircleBaseAnnotationInterface as CircleBaseAnnotation } from 'Draw/bases/annotate/circle/CircleBaseAnnotationInterface';

export interface PulsedProps {
  radius?: number;
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
}

export interface PulseProps {
  duration?: number;
}

export function pulsateBetween(cba: CircleBaseAnnotation, pulsedProps: PulsedProps, pulseProps?: PulseProps) {
  try {
    let withoutFill = {
      'r': pulsedProps.radius ?? cba.circle.attr('r'),
      'fill-opacity': pulsedProps.fillOpacity ?? cba.circle.attr('fill-opacity'),
      'stroke': pulsedProps.stroke ?? cba.circle.attr('stroke'),
      'stroke-width': pulsedProps.strokeWidth ?? cba.circle.attr('stroke-width'),
      'stroke-opacity': pulsedProps.strokeOpacity ?? cba.circle.attr('stroke-opacity'),
    };
    let fill = pulsedProps.fill ?? cba.circle.attr('fill');
    let withFill = fill == 'none' ? {} : { 'fill': fill };
    let attrs = { ...withoutFill, ...withFill };
    let duration = pulseProps?.duration ?? 2000;
    cba.circle.animate(duration).attr(attrs).loop(undefined, true);
  } catch (error) {
    console.error(error);
    console.error('Unable to pulsate circle base annotation.');
  }
}
