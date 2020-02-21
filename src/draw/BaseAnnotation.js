import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';
import createUUIDforSVG from './createUUIDforSVG';

class CircleBaseAnnotation {
  
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
    this._circle = circle;
    this._validateCircle();
    this._storeDisplacement(xCenterBase, yCenterBase, baseClockwiseNormalAngle);
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
   * Shifts the circle of this base annotation and updates the displacement of the circle.
   * 
   * @param {number} xShift 
   * @param {number} yShift 
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

  get radius() {
    return this._circle.attr('r');
  }

  get fill() {
    return this._circle.attr('fill');
  }

  get fillOpacity() {
    return this._circle.attr('fill-opacity');
  }

  get stroke() {
    return this._circle.attr('stroke');
  }

  get strokeWidth() {
    return this._circle.attr('stroke-width');
  }

  get strokeOpacity() {
    return this._circle.attr('stroke-opacity');
  }
}

export {
  CircleBaseAnnotation,
};
