import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import normalizeAngle from ',/normalizeAngle';
import createUUIDforSVG from './createUUIDforSVG';

class CircleBaseAnnotation {
  
  create(svg, zCeiling,) {

  }

  constructor(circle, xCenterBase, yCenterBase, baseOutwardNormalAngle) {
    this._circle = circle;
    this._validateCircle();
    this._storeDisplacement(xCenterBase, yCenterBase, baseOutwardNormalAngle);
  }

  _validateCircle() {}

  _storeDisplacement(xCenterBase, yCenterBase, baseOutwardNormalAngle) {
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

    this._displacementAngle = normalizeAngle(angle, baseOutwardNormalAngle) - baseOutwardNormalAngle;
  }

  reposition(xCenterBase, yCenterBase, baseOutwardNormalAngle) {
    let angle = baseOutwardNormalAngle + this._displacementAngle;

    this._circle.attr({
      'cx': xCenterBase + (this._displacementLength * Math.cos(angle)),
      'cy': yCenterBase + (this._displacementLength * Math.sin(angle)),
    });
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
