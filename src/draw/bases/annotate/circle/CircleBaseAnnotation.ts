import {
  CircleBaseAnnotationInterface,
  CircleBaseAnnotationPulsableProps,
  PulseProps,
  CircleBaseAnnotationSavableState,
} from './CircleBaseAnnotationInterface';
import * as SVG from '@svgdotjs/svg.js';

export class CircleBaseAnnotation implements CircleBaseAnnotationInterface {
  readonly circle: SVG.Circle;

  _currPulsation?: SVG.Runner;

  static fromSavedState(
    savedState: CircleBaseAnnotationSavableState,
    svg: SVG.Svg,
    xBaseCenter: number,
    yBaseCenter: number,
  ): (CircleBaseAnnotation | never) {
    if (savedState.className !== 'CircleBaseAnnotation') {
      throw new Error('Wrong class name.');
    }
    let circle = svg.findOne('#' + savedState.circleId);
    return new CircleBaseAnnotation(circle as SVG.Circle, xBaseCenter, yBaseCenter);
  }

  static createNondisplaced(svg: SVG.Svg, xBaseCenter: number, yBaseCenter: number): CircleBaseAnnotation {
    let circle = svg.circle(20);
    circle.id();
    circle.attr({ 'cx': xBaseCenter, 'cy': yBaseCenter });
    return new CircleBaseAnnotation(circle, xBaseCenter, yBaseCenter);
  }

  constructor(circle: SVG.Circle, xBaseCenter: number, yBaseCenter: number) {
    this.circle = circle;
    this._validateCircle();
  }

  /**
   * Throws if the circle is not actually a circle.
   *
   * Initializes the ID of the circle if it is not already initialized.
   */
  _validateCircle(): (void | never) {
    if (this.circle.type !== 'circle') {
      throw new Error('Passed SVG element must be a circle.');
    }
    this.circle.id();
  }

  get id(): string {
    return this.circle.id();
  }

  reposition(xBaseCenter: number, yBaseCenter: number) {
    this.circle.attr({
      'cx': xBaseCenter,
      'cy': yBaseCenter,
    });
  }

  bringToFront() {
    this.circle.front();
  }

  sendToBack() {
    this.circle.back();
  }

  pulsateBetween(pulsedProps: CircleBaseAnnotationPulsableProps, pulseProps?: PulseProps) {
    this.stopPulsating();
    let withoutFill = {
      'r': pulsedProps.radius ?? this.circle.attr('r'),
      'fill-opacity': pulsedProps.fillOpacity ?? this.circle.attr('fill-opacity'),
      'stroke': pulsedProps.stroke ?? this.circle.attr('stroke'),
      'stroke-width': pulsedProps.strokeWidth ?? this.circle.attr('stroke-width'),
      'stroke-opacity': pulsedProps.strokeOpacity ?? this.circle.attr('stroke-opacity'),
    };
    let fill = pulsedProps.fill ?? this.circle.attr('fill');
    let withFill = fill == 'none' ? {} : { 'fill': fill };
    let attrs = { ...withoutFill, ...withFill };
    let duration = pulseProps?.duration ?? 2000;
    this._currPulsation = this.circle.animate(duration).attr(attrs).loop(undefined, true);
  }

  stopPulsating() {
    if (this._currPulsation) {
      this.circle.timeline().unschedule(this._currPulsation);
      this._currPulsation = undefined;
    }
  }

  remove() {
    this.circle.remove();
  }

  savableState(): CircleBaseAnnotationSavableState {
    return {
      className: 'CircleBaseAnnotation',
      circleId: this.circle.id(),
    };
  }

  refreshIds() {
    this.circle.id('');
    this.circle.id();
  }
}
