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
  circleCircumference,

  // these are only exported to aid testing
  _lowerBound,
  _upperBound,
  _estimateIsTooLow,
};
