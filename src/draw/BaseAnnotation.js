import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';

class BaseAnnotation {
  
  /**
   * @param {SVG.Svg} svg 
   * @param {number} xBaseCenter 
   * @param {number} yBaseCenter 
   */
  static createNondisplaced(svg, xBaseCenter, yBaseCenter) {}

  /**
   * @returns {string} 
   */
  get type() {}

  /**
   * @returns {string} 
   */
  get id() {}

  /**
   * @returns {number} 
   */
  get xCenter() {}

  /**
   * @returns {number} 
   */
  get yCenter() {}

  /**
   * @returns {number} 
   */
  get displacementLength() {}

  /**
   * @returns {number} 
   */
  get displacementAngle() {}

  /**
   * @param {number} xShift 
   * @param {number} yShift 
   */
  shift(xShift, yShift) {}

  /**
   * @param {number} xBaseCenter 
   * @param {number} yBaseCenter 
   */
  reposition(xBaseCenter, yBaseCenter) {}

  /**
   * @param {SVG.Element} ele 
   */
  insertBefore(ele) {}

  /**
   * @param {SVG.Element} ele 
   */
  insertAfter(ele) {}

  remove() {}

  /**
   * @returns {Object} 
   */
  savableState() {}
}

class CircleBaseAnnotation extends BaseAnnotation {

  /**
   * Returns null if the saved state is invalid.
   * 
   * @param {CircleBaseAnnotation~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * @param {number} xBaseCenter 
   * @param {number} yBaseCenter 
   * 
   * @returns {CircleBaseAnnotation|null} 
   */
  static fromSavedState(savedState, svg, xBaseCenter, yBaseCenter) {
    if (savedState.className !== 'CircleBaseAnnotation') {
      return null;
    }
    let circle = svg.findOne('#' + savedState.circleId);
    try {
      return new CircleBaseAnnotation(circle, xBaseCenter, yBaseCenter);
    } catch (err) {}
    return null;
  }
  
  /**
   * @param {SVG.Svg} svg 
   * @param {number} xBaseCenter 
   * @param {number} yBaseCenter 
   */
  static createNondisplaced(svg, xBaseCenter, yBaseCenter) {
    let circle = svg.circle(20);
    circle.id();
    circle.attr({
      'cx': xBaseCenter,
      'cy': yBaseCenter
    });
    return new CircleBaseAnnotation(circle, xBaseCenter, yBaseCenter, 0);
  }

  /**
   * @param {SVG.Circle} circle 
   * @param {number} xBaseCenter 
   * @param {number} yBaseCenter 
   */
  constructor(circle, xBaseCenter, yBaseCenter) {
    super();

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

  /**
   * @returns {string} 
   */
  get type() {
    return 'circle';
  }

  /**
   * @returns {string} 
   */
  get id() {
    return this._circle.id();
  }

  /**
   * @returns {number} 
   */
  get xCenter() {
    return this._circle.attr('cx');
  }

  /**
   * @returns {number} 
   */
  get yCenter() {
    return this._circle.attr('cy');
  }

  /**
   * Sets the _displacementLength and _displacementAngle properties.
   * 
   * @param {number} xBaseCenter 
   * @param {number} yBaseCenter 
   */
  _storeDisplacement(xBaseCenter, yBaseCenter) {
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

  /**
   * @returns {number} 
   */
  get displacementLength() {
    return this._displacementLength;
  }

  /**
   * @returns {number} 
   */
  get displacementAngle() {
    return this._displacementAngle;
  }

  /**
   * @param {number} xShift 
   * @param {number} yShift 
   */
  shift(xShift, yShift) {
    let xBaseCenter = this.xCenter + (this.displacementLength * Math.cos(this.displacementAngle + Math.PI));
    let yBaseCenter = this.yCenter + (this.displacementLength * Math.sin(this.displacementAngle + Math.PI));
    this._circle.attr({
      'cx': this.xCenter + xShift,
      'cy': this.yCenter + yShift,
    });
    this._storeDisplacement(xBaseCenter, yBaseCenter);
  }

  /**
   * @param {number} xBaseCenter 
   * @param {number} yBaseCenter 
   */
  reposition(xBaseCenter, yBaseCenter) {
    this._circle.attr({
      'cx': xBaseCenter + (this.displacementLength * Math.cos(this.displacementAngle)),
      'cy': yBaseCenter + (this.displacementLength * Math.sin(this.displacementAngle)),
    });
  }

  /**
   * @param {SVG.Element} ele 
   */
  insertBefore(ele) {
    this._circle.insertBefore(ele);
  }

  /**
   * @param {SVG.Element} ele 
   */
  insertAfter(ele) {
    this._circle.insertAfter(ele);
  }

  /**
   * @returns {number} 
   */
  get radius() {
    return this._circle.attr('r');
  }

  /**
   * @param {number} r 
   */
  set radius(r) {
    this._circle.attr({ 'r': r });
  }

  /**
   * @returns {string} 
   */
  get fill() {
    return this._circle.attr('fill');
  }

  /**
   * @param {string} f 
   */
  set fill(f) {
    this._circle.attr({ 'fill': f });
  }

  /**
   * @returns {number} 
   */
  get fillOpacity() {
    return this._circle.attr('fill-opacity');
  }

  /**
   * @param {number} fo 
   */
  set fillOpacity(fo) {
    this._circle.attr({ 'fill-opacity': fo });
  }

  /**
   * @returns {string} 
   */
  get stroke() {
    return this._circle.attr('stroke');
  }

  /**
   * @param {string} s 
   */
  set stroke(s) {
    this._circle.attr({ 'stroke': s });
  }

  /**
   * @returns {number} 
   */
  get strokeWidth() {
    return this._circle.attr('stroke-width');
  }

  /**
   * @param {number} sw 
   */
  set strokeWidth(sw) {
    this._circle.attr({ 'stroke-width': sw });
  }

  /**
   * @returns {number} 
   */
  get strokeOpacity() {
    return this._circle.attr('stroke-opacity');
  }

  /**
   * @param {number} so 
   */
  set strokeOpacity(so) {
    this._circle.attr({ 'stroke-opacity': so });
  }

  remove() {
    this._circle.remove();
  }

  /**
   * @typedef {Object} CircleBaseAnnotation~SavableState 
   * @property {string} className 
   * @property {string} circleId 
   */

  /**
   * @returns {CircleBaseAnnotation~SavableState} 
   */
  savableState() {
    return {
      className: 'CircleBaseAnnotation',
      circleId: this._circle.id(),
    };
  }
}

export {
  BaseAnnotation,
  CircleBaseAnnotation,
};
