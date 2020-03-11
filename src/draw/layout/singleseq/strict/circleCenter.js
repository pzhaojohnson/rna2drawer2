import distanceBetween from './../../../distanceBetween';
import polarizeLength from './polarizeLength';
import angleBetween from './../../../angleBetween';

function _moreThanSemicircle(x1, y1, x2, y2, clockwisePolarDistance) {
  let straightDistance = Math.max(
    distanceBetween(x1, y1, x2, y2),
    0.001,
  );

  clockwisePolarDistance = Math.max(
    clockwisePolarDistance,
    (Math.PI * straightDistance / 2) + 0.001,
  );

  let circumference = clockwisePolarDistance + polarizeLength(straightDistance);
  let radius = circumference / (2 * Math.PI);
  
  let angleToCenter = angleBetween(x1, y1, x2, y2)
    + (Math.PI / 2)
    - Math.asin((straightDistance / 2) / radius);

  return {
    x: x1 + (radius * Math.cos(angleToCenter)),
    y: y1 + (radius * Math.sin(angleToCenter)),
  };
}

/**
 * Calculates the angle between the straight line connecting the
 * two points on the periphery of the circle and the tangent to
 * the circle at either point.
 * 
 * Requires that polarDistance < Math.PI * straightDistance / 2
 * and that straightDistance not be too small.
 */
function _straightTangentAngle(clockwisePolarDistance, straightDistance) {
  let p = clockwisePolarDistance / 2;
  let s = straightDistance / 2;
  
  /* The angle must be between 0 and (Math.PI / 2).
  (Math.PI / 2) seems to work well as an initial guess. */
  let a = Math.PI / 2;
  
  // 20 iterations seems to work well
  let iters = 20;
  
  // Newton's method of approximation
  for (let i = 0; i < iters; i++) {
    let y = ((p / s) * Math.sin(a)) - a;
    let yPrime = ((p / s) * Math.cos(a)) - 1;
    a -= y / yPrime;
  }
  
  return a;
}

function _lessThanSemicircle(x1, y1, x2, y2, clockwisePolarDistance) {
  let straightDistance = Math.max(
    distanceBetween(x1, y1, x2, y2),
    0.002,
  );

  clockwisePolarDistance = Math.min(
    clockwisePolarDistance,
    (Math.PI * straightDistance / 2) - 0.001,
  );

  let sta = _straightTangentAngle(clockwisePolarDistance, straightDistance);
  
  let angleToCenter = angleBetween(x1, y1, x2, y2)
    - (Math.PI / 2)
    + sta;
  
  let radius = (straightDistance / 2) / Math.sin(sta);

  return {
    x: x1 + (radius * Math.cos(angleToCenter)),
    y: y1 + (radius * Math.sin(angleToCenter)),
  };
}

/**
 * @typedef {Object} CircleCenter 
 * @property {number} x 
 * @property {number} y 
 */

/**
 * Calculates the center point of a circle given two points on the periphery
 * of the circle and the polar distance between the two points going clockwise
 * from point 1 to point 2.
 * 
 * To prevent number overflow, if the given two points and clockwise polar distance
 * specify a circle large enough to cause number overflow, then the center point
 * for a smaller but still large circle will be returned that, practically speaking,
 * would appear very similar to the true circle in a drawing of an RNA structure.
 * 
 * If the given clockwise polar distance is less than the straight distance between
 * the two points on the periphery of the circle, then this function will calculate
 * the center point of the circle using a clockwise polar distance "slightly" larger
 * than the straight distance.
 * 
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 * @param {number} clockwisePolarDistance 
 * 
 * @returns {CircleCenter} 
 */
function circleCenter(x1, y1, x2, y2, clockwisePolarDistance) {
  let straightDistance = distanceBetween(x1, y1, x2, y2);
  
  // clockwise polar distance spans more than half the circle
  if (clockwisePolarDistance > Math.PI * straightDistance / 2) {
    return _moreThanSemicircle(x1, y1, x2, y2, clockwisePolarDistance);
  } else {
    return _lessThanSemicircle(x1, y1, x2, y2, clockwisePolarDistance);
  }
}

export default circleCenter;
