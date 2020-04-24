import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';

class BaseAnnotation {
  
  /**
   * @param {SVG.Doc} svg 
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
   * Shifts the element of this base annotation.
   * 
   * @param {number} xShift 
   * @param {number} yShift 
   * @param {number} xBaseCenter 
   * @param {number} yBaseCenter 
   * @param {number} referenceAngle 
   */
  shift(xShift, yShift, xBaseCenter, yBaseCenter, referenceAngle) {}

  /**
   * @param {number} xBaseCenter 
   * @param {number} yBaseCenter 
   * @param {number} referenceAngle 
   */
  reposition(xBaseCenter, yBaseCenter, referenceAngle) {}

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
   * @param {number} referenceAngle 
   * 
   * @returns {CircleBaseAnnotation|null} 
   */
  static fromSavedState(savedState, svg, xBaseCenter, yBaseCenter, referenceAngle) {
    if (savedState.className !== 'CircleBaseAnnotation') {
      return null;
    }
    let circle = svg.findOne('#' + savedState.circle);
    try {
      return new CircleBaseAnnotation(circle, xBaseCenter, yBaseCenter, referenceAngle);
    } catch (err) {}
    return null;
  }
  
  /**
   * @param {SVG.Doc} svg 
   * @param {number} xBaseCenter 
   * @param {number} yBaseCenter 
   */
  static createNondisplaced(svg, xBaseCenter, yBaseCenter) {
    let circle = svg.circle(10);
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
   * @param {number} referenceAngle 
   */
  constructor(circle, xBaseCenter, yBaseCenter, referenceAngle) {
    super();

    this._circle = circle;
    this._validateCircle();
    this._storeDisplacement(xBaseCenter, yBaseCenter, referenceAngle);
  }

  /**
   * @returns {string} 
   */
  get type() {
    return 'circle';
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
   * @param {number} referenceAngle 
   */
  _storeDisplacement(xBaseCenter, yBaseCenter, referenceAngle) {
    this._displacementLength = distanceBetween(
      xBaseCenter,
      yBaseCenter,
      this.xCenter,
      this.yCenter,
    );
    let angle = angleBetween(
      xBaseCenter,
      yBaseCenter,
      this.xCenter,
      this.yCenter,
    );
    this._displacementAngle = normalizeAngle(angle, referenceAngle) - referenceAngle;
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
   * @param {number} xBaseCenter 
   * @param {number} yBaseCenter 
   * @param {number} referenceAngle 
   */
  shift(xShift, yShift, xBaseCenter, yBaseCenter, referenceAngle) {
    this._circle.attr({
      'cx': this.xCenter + xShift,
      'cy': this.yCenter + yShift,
    });
    this._storeDisplacement(xBaseCenter, yBaseCenter, referenceAngle);
  }

  /**
   * Repositions the circle of this base annotation based on the given base coordinates
   * and clockwise normal angle and the stored displacement of the circle.
   * 
   * @param {number} xBaseCenter 
   * @param {number} yBaseCenter 
   * @param {number} referenceAngle 
   */
  reposition(xBaseCenter, yBaseCenter, referenceAngle) {
    let angle = referenceAngle + this._displacementAngle;
    this._circle.attr({
      'cx': xBaseCenter + (this._displacementLength * Math.cos(angle)),
      'cy': yBaseCenter + (this._displacementLength * Math.sin(angle)),
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
   * @property {string} circle 
   */

  /**
   * @returns {CircleBaseAnnotation~SavableState} 
   */
  savableState() {
    return {
      className: 'CircleBaseAnnotation',
      circle: this._circle.id(),
    };
  }
}

export {
  BaseAnnotation,
  CircleBaseAnnotation,
};
