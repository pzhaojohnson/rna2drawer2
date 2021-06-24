import {
  CircleBaseAnnotationInterface,
  CircleBaseAnnotationPulsableProps,
  PulseProps,
  CircleBaseAnnotationSavableState,
} from './BaseAnnotationInterface';
import { distance2D as distance } from 'Math/distance';
import angleBetween from './angleBetween';
import * as Svg from '@svgdotjs/svg.js';

export class CircleBaseAnnotation implements CircleBaseAnnotationInterface {
  readonly circle: Svg.Circle;

  _displacementLength!: number;
  _displacementAngle!: number;

  _currPulsation?: Svg.Runner;

  static fromSavedState(
    savedState: CircleBaseAnnotationSavableState,
    svg: Svg.Svg,
    xBaseCenter: number,
    yBaseCenter: number,
  ): (CircleBaseAnnotation | never) {
    if (savedState.className !== 'CircleBaseAnnotation') {
      throw new Error('Wrong class name.');
    }
    let circle = svg.findOne('#' + savedState.circleId);
    return new CircleBaseAnnotation(circle as Svg.Circle, xBaseCenter, yBaseCenter);
  }

  static createNondisplaced(svg: Svg.Svg, xBaseCenter: number, yBaseCenter: number): CircleBaseAnnotation {
    let circle = svg.circle(20);
    circle.id();
    circle.attr({ 'cx': xBaseCenter, 'cy': yBaseCenter });
    return new CircleBaseAnnotation(circle, xBaseCenter, yBaseCenter);
  }

  constructor(circle: Svg.Circle, xBaseCenter: number, yBaseCenter: number) {
    this.circle = circle;
    this._validateCircle();
    this._storeDisplacement(xBaseCenter, yBaseCenter);
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

  get xCenter(): number {
    return this.circle.attr('cx');
  }

  get yCenter(): number {
    return this.circle.attr('cy');
  }

  /**
   * Sets the _displacementLength and _displacementAngle properties.
   */
  _storeDisplacement(xBaseCenter: number, yBaseCenter: number) {
    this._displacementLength = distance(
      xBaseCenter,
      yBaseCenter,
      this.xCenter,
      this.yCenter,
    );
    this._displacementAngle = angleBetween(
      xBaseCenter,
      yBaseCenter,
      this.xCenter,
      this.yCenter,
    );
  }

  get displacementLength(): number {
    return this._displacementLength;
  }

  get displacementAngle(): number {
    return this._displacementAngle;
  }

  shift(xShift: number, yShift: number) {
    let xBaseCenter = this.xCenter + (this.displacementLength * Math.cos(this.displacementAngle + Math.PI));
    let yBaseCenter = this.yCenter + (this.displacementLength * Math.sin(this.displacementAngle + Math.PI));
    this.circle.attr({
      'cx': this.xCenter + xShift,
      'cy': this.yCenter + yShift,
    });
    this._storeDisplacement(xBaseCenter, yBaseCenter);
  }

  reposition(xBaseCenter: number, yBaseCenter: number) {
    this.circle.attr({
      'cx': xBaseCenter + (this.displacementLength * Math.cos(this.displacementAngle)),
      'cy': yBaseCenter + (this.displacementLength * Math.sin(this.displacementAngle)),
    });
  }

  bringToFront() {
    this.circle.front();
  }

  sendToBack() {
    this.circle.back();
  }

  get fill(): string {
    return this.circle.attr('fill');
  }

  set fill(f: string) {
    this.stopPulsating();
    this.circle.attr({ 'fill': f });
  }

  get fillOpacity(): number {
    return this.circle.attr('fill-opacity');
  }

  set fillOpacity(fo: number) {
    this.stopPulsating();
    this.circle.attr({ 'fill-opacity': fo });
  }

  get stroke(): string {
    return this.circle.attr('stroke');
  }

  set stroke(s: string) {
    this.stopPulsating();
    this.circle.attr({ 'stroke': s });
  }

  get strokeWidth(): number {
    return this.circle.attr('stroke-width');
  }

  set strokeWidth(sw: number) {
    this.stopPulsating();
    this.circle.attr({ 'stroke-width': sw });
  }

  get strokeOpacity(): number {
    return this.circle.attr('stroke-opacity');
  }

  set strokeOpacity(so: number) {
    this.stopPulsating();
    this.circle.attr({ 'stroke-opacity': so });
  }

  get strokeDasharray(): string | null | undefined {
    return this.circle.attr('stroke-dasharray');
  }

  set strokeDasharray(da) {
    this.circle.attr({ 'stroke-dasharray': da });
  }

  pulsateBetween(pulsedProps: CircleBaseAnnotationPulsableProps, pulseProps?: PulseProps) {
    this.stopPulsating();
    let withoutFill = {
      'r': pulsedProps.radius ?? this.circle.attr('r'),
      'fill-opacity': pulsedProps.fillOpacity ?? this.fillOpacity,
      'stroke': pulsedProps.stroke ?? this.stroke,
      'stroke-width': pulsedProps.strokeWidth ?? this.strokeWidth,
      'stroke-opacity': pulsedProps.strokeOpacity ?? this.strokeOpacity,
    };
    let fill = pulsedProps.fill ?? this.fill;
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
