import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';
import createUUIDforSVG from './createUUIDforSVG';

class CircleBaseAnnotation {
  
  createNondisplaced(svg, xCenterBase, yCenterBase) {
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

  _storeDisplacement(xCenterBase, yCenterBase, baseClockwiseNormalAngle) {
    this._displacementLength = distanceBetween(
      xCenterBase,
      yCenterBase,
      this._circle.attr('cx'),
      this._circle.attr('cy'),
    );

    let angle = angleBetween(
      xCenterBase,
      yCenterBase,
      this._circle.attr('cx'),
      this._circle.attr('cy'),
    );

    this._displacementAngle = normalizeAngle(angle, baseClockwiseNormalAngle) - baseClockwiseNormalAngle;
  }

  reposition(xCenterBase, yCenterBase, baseClockwiseNormalAngle) {
    let angle = baseClockwiseNormalAngle + this._displacementAngle;

    this._circle.attr({
      'cx': xCenterBase + (this._displacementLength * Math.cos(angle)),
      'cy': yCenterBase + (this._displacementLength * Math.sin(angle)),
    });
  }

  insertBefore(ele) {
    this._circle.insertBefore(ele);
  }

  insertAfter(ele) {
    this._circle.insertAfter(ele);
  }

  get xCenter() {
    return this._circle.attr('cx');
  }

  get yCenter() {
    return this._circle.attr('cy');
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
