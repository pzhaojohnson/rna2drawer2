import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';
import createUUIDforSVG from './createUUIDforSVG';

class BaseAnnotation {
  
  /**
   * @param {SVG.Doc} svg 
   * @param {number} xCenterBase 
   * @param {number} yCenterBase 
   */
  static createNondisplaced(svg, xCenterBase, yCenterBase) {
    throw new Error('Not implemented.');
  }

  /**
   * @returns {string} 
   */
  get type() {
    throw new Error('Not implemented.');
  }

  /**
   * @returns {string} 
   */
  get id() {
    throw new Error('Not implemented.');
  }

  /**
   * @returns {number} 
   */
  get xCenter() {
    throw new Error('Not implemented.');
  }

  /**
   * @returns {number} 
   */
  get yCenter() {
    throw new Error('Not implemented');
  }

  /**
   * @returns {number} 
   */
  get displacementLength() {
    throw new Error('Not implemented');
  }

  /**
   * @returns {number} 
   */
  get displacementAngle() {
    throw new Error('Not implemented');
  }

  /**
   * Shifts the element of this base annotation.
   * 
   * @param {number} xShift 
   * @param {number} yShift 
   * @param {number} xCenterBase 
   * @param {number} yCenterBase 
   * @param {number} baseClockwiseNormalAngle 
   */
  shift(xShift, yShift, xCenterBase, yCenterBase, baseClockwiseNormalAngle) {
    throw new Error('Not implemented');
  }

  /**
   * @param {number} xCenterBase 
   * @param {number} yCenterBase 
   * @param {number} baseClockwiseNormalAngle 
   */
  reposition(xCenterBase, yCenterBase, baseClockwiseNormalAngle) {
    throw new Error('Not implemented');
  }

  /**
   * @param {SVG.Element} ele 
   */
  insertBefore(ele) {
    throw new Error('Not implemented');
  }

  /**
   * @param {SVG.Element} ele 
   */
  insertAfter(ele) {
    throw new Error('Not implemented');
  }
}

class CircleBaseAnnotation extends BaseAnnotation {
  
  /**
   * @param {SVG.Doc} svg 
   * @param {number} xCenterBase 
   * @param {number} yCenterBase 
   */
  static createNondisplaced(svg, xCenterBase, yCenterBase) {
    let circle = svg.circle(10);

    circle.attr({
      'id': createUUIDforSVG(),
      'cx': xCenterBase,
      'cy': yCenterBase
    });
    
    return new CircleBaseAnnotation(circle, xCenterBase, yCenterBase, 0);
  }

  /**
   * @param {SVG.Circle} circle 
   * @param {number} xCenterBase 
   * @param {number} yCenterBase 
   * @param {number} baseClockwiseNormalAngle 
   */
  constructor(circle, xCenterBase, yCenterBase, baseClockwiseNormalAngle) {
    super();

    this._circle = circle;
    this._validateCircle();
    this._storeDisplacement(xCenterBase, yCenterBase, baseClockwiseNormalAngle);
  }

  /**
   * @returns {string} 
   */
  get type() {
    return 'circle';
  }

  /**
   * Validates the circle of this base annotation.
   * 
   * @throws {Error} If the ID of the circle is not a string or an empty string.
   */
  _validateCircle() {
    if (typeof(this._circle.id()) !== 'string' || this._circle.id().length === 0) {
      throw new Error('The circle must have a unique ID.');
    }
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
   * @param {number} xCenterBase 
   * @param {number} yCenterBase 
   * @param {number} baseClockwiseNormalAngle 
   */
  _storeDisplacement(xCenterBase, yCenterBase, baseClockwiseNormalAngle) {
    this._displacementLength = distanceBetween(
      xCenterBase,
      yCenterBase,
      this.xCenter,
      this.yCenter,
    );

    let angle = angleBetween(
      xCenterBase,
      yCenterBase,
      this.xCenter,
      this.yCenter,
    );

    this._displacementAngle = normalizeAngle(angle, baseClockwiseNormalAngle) - baseClockwiseNormalAngle;
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
   * @param {number} xCenterBase 
   * @param {number} yCenterBase 
   * @param {number} baseClockwiseNormalAngle 
   */
  shift(xShift, yShift, xCenterBase, yCenterBase, baseClockwiseNormalAngle) {
    this._circle.attr({
      'cx': this.xCenter + xShift,
      'cy': this.yCenter + yShift,
    });

    this._storeDisplacement(xCenterBase, yCenterBase, baseClockwiseNormalAngle);
  }

  /**
   * Repositions the circle of this base annotation based on the given base coordinates
   * and clockwise normal angle and the stored displacement of the circle.
   * 
   * @param {number} xCenterBase 
   * @param {number} yCenterBase 
   * @param {number} baseClockwiseNormalAngle 
   */
  reposition(xCenterBase, yCenterBase, baseClockwiseNormalAngle) {
    let angle = baseClockwiseNormalAngle + this._displacementAngle;

    this._circle.attr({
      'cx': xCenterBase + (this._displacementLength * Math.cos(angle)),
      'cy': yCenterBase + (this._displacementLength * Math.sin(angle)),
    });
  }

  /**
   * Inserts the circle of this base annotation before the given element.
   * 
   * @param {SVG.Element} ele 
   */
  insertBefore(ele) {
    this._circle.insertBefore(ele);
  }

  /**
   * Inserts the circle of this base annotation after the given element.
   * 
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
}

export {
  BaseAnnotation,
  CircleBaseAnnotation,
};
