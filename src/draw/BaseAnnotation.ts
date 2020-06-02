import {
  BaseAnnotationInterface,
  CircleBaseAnnotationSavableState,
} from './BaseAnnotationInterface';
import {
  SvgInterface as Svg,
  SvgElementInterface as SvgElement,
  SvgCircleInterface as SvgCircle,
} from './SvgInterface';
import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';

export class CircleBaseAnnotation implements BaseAnnotationInterface {
  _circle: SvgCircle;
  _displacementLength: number;
  _displacementAngle: number;

  static fromSavedState(
    savedState: CircleBaseAnnotationSavableState,
    svg: Svg,
    xBaseCenter: number,
    yBaseCenter: number,
  ): (CircleBaseAnnotation | never) {
    if (savedState.className !== 'CircleBaseAnnotation') {
      throw new Error('Wrong class name.');
    }
    let circle = svg.findOne('#' + savedState.circleId);
    return new CircleBaseAnnotation(circle, xBaseCenter, yBaseCenter);
  }
  
  static createNondisplaced(svg: Svg, xBaseCenter: number, yBaseCenter: number): CircleBaseAnnotation {
    let circle = svg.circle(20);
    circle.id();
    circle.attr({ 'cx': xBaseCenter, 'cy': yBaseCenter });
    return new CircleBaseAnnotation(circle, xBaseCenter, yBaseCenter);
  }

  constructor(circle: SvgCircle, xBaseCenter: number, yBaseCenter: number) {
    this._circle = circle;
    this._validateCircle();
    this._storeDisplacement(xBaseCenter, yBaseCenter);
  }

  /**
   * Initializes the ID of the circle if it is not already initialized.
   */
  _validateCircle() {
    this._circle.id();
  }

  get type(): string {
    return 'circle';
  }

  get id(): string {
    return this._circle.id();
  }

  get xCenter(): number {
    return this._circle.attr('cx');
  }

  get yCenter(): number {
    return this._circle.attr('cy');
  }

  /**
   * Sets the _displacementLength and _displacementAngle properties.
   */
  _storeDisplacement(xBaseCenter: number, yBaseCenter: number) {
    this._displacementLength = distanceBetween(
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
    this._circle.attr({
      'cx': this.xCenter + xShift,
      'cy': this.yCenter + yShift,
    });
    this._storeDisplacement(xBaseCenter, yBaseCenter);
  }

  reposition(xBaseCenter: number, yBaseCenter: number) {
    this._circle.attr({
      'cx': xBaseCenter + (this.displacementLength * Math.cos(this.displacementAngle)),
      'cy': yBaseCenter + (this.displacementLength * Math.sin(this.displacementAngle)),
    });
  }

  insertBefore(ele: SvgElement) {
    this._circle.insertBefore(ele);
  }

  insertAfter(ele: SvgElement) {
    this._circle.insertAfter(ele);
  }

  get radius(): number {
    return this._circle.attr('r');
  }

  set radius(r: number) {
    this._circle.attr({ 'r': r });
  }

  get fill(): string {
    return this._circle.attr('fill');
  }

  set fill(f: string) {
    this._circle.attr({ 'fill': f });
  }

  get fillOpacity(): number {
    return this._circle.attr('fill-opacity');
  }

  set fillOpacity(fo: number) {
    this._circle.attr({ 'fill-opacity': fo });
  }

  get stroke(): string {
    return this._circle.attr('stroke');
  }

  set stroke(s: string) {
    this._circle.attr({ 'stroke': s });
  }

  get strokeWidth(): number {
    return this._circle.attr('stroke-width');
  }

  set strokeWidth(sw: number) {
    this._circle.attr({ 'stroke-width': sw });
  }

  get strokeOpacity(): number {
    return this._circle.attr('stroke-opacity');
  }

  set strokeOpacity(so: number) {
    this._circle.attr({ 'stroke-opacity': so });
  }

  remove() {
    this._circle.remove();
  }

  savableState(): CircleBaseAnnotationSavableState {
    return {
      className: 'CircleBaseAnnotation',
      circleId: this._circle.id(),
    };
  }

  refreshIds() {
    this._circle.id(null);
    this._circle.id();
  }
}
