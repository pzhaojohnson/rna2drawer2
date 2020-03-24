import distanceBetween from './../../../distanceBetween';
import angleBetween from './../../../angleBetween';

/**
 * Calculates the angle between the straight line connecting the
 * two points on the periphery of the circle and the tangent to
 * the circle at either point.
 */
function _straightTangentAngle(clockwisePolarDistance, straightDistance) {
  let p = clockwisePolarDistance / 2;
  let s = straightDistance / 2;
  
  // 20 iterations seems to work well
  let iters = 20;
  
  function moreThanSemicircle() {

    // Math.PI seems to work well as an initial guess
    let b = Math.PI;

    // Newton's method of approximation
    for (let i = 0; i < iters; i++) {
      let y = ((p / s) * Math.sin(Math.PI - b)) - b;
      let yPrime = -((p / s) * Math.cos(Math.PI - b)) - 1;
      b -= y / yPrime;
    }

    return Math.PI - b;
  }

  function lessThanSemicircle() {
    
    // Math.PI / 2 seems to work well as an initial guess.
    let a = Math.PI / 2;
    
    // Newton's method of approximation
    for (let i = 0; i < iters; i++) {
      let y = ((p / s) * Math.sin(a)) - a;
      let yPrime = ((p / s) * Math.cos(a)) - 1;
      a -= y / yPrime;
    }
    
    return a;
  }

  if (clockwisePolarDistance > Math.PI * (straightDistance / 2)) {
    return moreThanSemicircle();
  } else {
    return lessThanSemicircle();
  }
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
  let straightDistance = Math.max(
    distanceBetween(x1, y1, x2, y2),
    0.001,
  );
  clockwisePolarDistance = Math.max(
    clockwisePolarDistance,
    straightDistance + 0.001,
  );

  let angleToCenter = angleBetween(x1, y1, x2, y2);
  let sta = _straightTangentAngle(clockwisePolarDistance, straightDistance);
  if (clockwisePolarDistance > Math.PI * (straightDistance / 2)) {
    angleToCenter -= (Math.PI / 2) - sta;
  } else {
    angleToCenter += (Math.PI / 2) - sta;
  }
  
  let radius = (straightDistance / 2) / Math.sin(sta);
  return {
    x: x1 + (radius * Math.cos(angleToCenter)),
    y: y1 + (radius * Math.sin(angleToCenter)),
  };
}

function _lowerBound(straightLength, numStraights, remainingPolarLength) {
  return (numStraights * straightLength) + remainingPolarLength;
}

function _upperBound(straightLength, numStraights, remainingPolarLength) {
  let straightCircumference = (numStraights * straightLength) + remainingPolarLength;
  let totalNumStraights = straightCircumference / straightLength;
  let straightAngle = (2 * Math.PI) / totalNumStraights;
  let radius = (straightLength / 2) / Math.sin(straightAngle / 2);
  return 2 * Math.PI * radius;
}

function _estimateIsTooLow(estimate, straightLength, numStraights, remainingPolarLength) {
  let remainingPolarAngle = (2 * Math.PI) * ((estimate - remainingPolarLength) / estimate);
  let straightAngle = ((2 * Math.PI) - remainingPolarAngle) / numStraights;
  let radius = estimate / (2 * Math.PI);
  return straightLength / 2 > radius * Math.sin(straightAngle / 2);
}

/**
 * @param {number} straightLength 
 * @param {number} numStraights 
 * @param {number} remainingPolarLength 
 */
function circleCircumference(straightLength, numStraights, remainingPolarLength) {
  let lb = _lowerBound(straightLength, numStraights, remainingPolarLength);
  let ub = _upperBound(straightLength, numStraights, remainingPolarLength);
  let estimate = (lb + ub) / 2;
  let iters = 20;
  for (let i = 0; i < iters; i++) {
    if (_estimateIsTooLow(estimate, straightLength, numStraights, remainingPolarLength)) {
      estimate = (estimate + ub) / 2;
    } else {
      estimate = (lb + estimate) / 2;
    }
  }
  return estimate;
}

export {
  circleCenter,
};
