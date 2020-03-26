import { circleCenter } from './circleCenter';

const _VERY_SMALL_THRESHOLD = 0.001;

/**
 * @param {number} straightLength 
 * @param {number} remainingPolarLength 
 * 
 * @returns {number} 
 */
function _oneStraightCircumference(straightLength, remainingPolarLength) {
  let center = circleCenter(0, 0, straightLength, 0, remainingPolarLength);
  let radius = ((center.x ** 2) + (center.y ** 2)) ** 0.5;
  return 2 * Math.PI * radius;
}

/**
 * @param {number} straightLength 
 * @param {number} numStraights 
 * @param {number} remainingPolarLength 
 * 
 * @param {number} 
 */
function _lowerBound(straightLength, numStraights, remainingPolarLength) {
  return (numStraights * straightLength) + remainingPolarLength;
}

/**
 * @param {number} straightLength 
 * @param {number} numStraights 
 * @param {number} remainingPolarLength 
 * 
 * @param {number} 
 */
function _upperBound(straightLength, numStraights, remainingPolarLength) {
  if (numStraights === 0) {
    return remainingPolarLength;
  } else if (straightLength < _VERY_SMALL_THRESHOLD) {
    return remainingPolarLength;
  } else if (numStraights === 1) {
    return _oneStraightCircumference(straightLength, remainingPolarLength);
  } else {
    let straightCircumference = (numStraights * straightLength) + remainingPolarLength;
    let totalNumStraights = straightCircumference / straightLength;
    let straightAngle = (2 * Math.PI) / totalNumStraights;
    let radius = (straightLength / 2) / Math.sin(straightAngle / 2);
    return 2 * Math.PI * radius;
  }
}

/**
 * @param {number} estimate 
 * @param {number} straightLength 
 * @param {number} numStraights 
 * @param {number} remainingPolarLength 
 * 
 * @param {boolean} 
 */
function _estimateIsTooLow(estimate, straightLength, numStraights, remainingPolarLength) {
  if (numStraights === 0) {
    return estimate < remainingPolarLength;
  } else if (straightLength < _VERY_SMALL_THRESHOLD) {
    return estimate < remainingPolarLength;
  } else if (numStraights === 1) {
    return estimate < _oneStraightCircumference(straightLength, remainingPolarLength);
  } else {
    let remainingPolarAngle = (2 * Math.PI) * (remainingPolarLength / estimate);
    let straightAngle = ((2 * Math.PI) - remainingPolarAngle) / numStraights;
    let radius = estimate / (2 * Math.PI);
    return straightLength / 2 > radius * Math.sin(straightAngle / 2);
  }
}

/**
 * @param {number} straightLength 
 * @param {number} numStraights 
 * @param {number} remainingPolarLength 
 * 
 * @returns {number} 
 */
function circleCircumference(straightLength, numStraights, remainingPolarLength) {
  if (numStraights === 0) {
    return remainingPolarLength;
  } else if (straightLength < _VERY_SMALL_THRESHOLD) {
    return remainingPolarLength;
  } else if (numStraights === 1) {
    return _oneStraightCircumference(straightLength, remainingPolarLength);
  } else {
    let lb = _lowerBound(straightLength, numStraights, remainingPolarLength);
    let ub = _upperBound(straightLength, numStraights, remainingPolarLength);
    let estimate = (lb + ub) / 2;
    let iters = 20;
    for (let i = 0; i < iters; i++) {
      if (_estimateIsTooLow(estimate, straightLength, numStraights, remainingPolarLength)) {
        let oldEstimate = estimate;
        estimate = (estimate + ub) / 2;
        lb = oldEstimate;
      } else {
        let oldEstimate = estimate;
        estimate = (lb + estimate) / 2;
        ub = oldEstimate;
      }
    }
    return estimate;
  }
}

export {
  circleCircumference,

  // these are only exported to aid testing
  _oneStraightCircumference,
  _lowerBound,
  _upperBound,
  _estimateIsTooLow,
};
