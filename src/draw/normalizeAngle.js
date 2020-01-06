/**
 * @param {number} angle 
 * @param {number} minAngle=0 
 * 
 * @returns {number} The given angle normalized to the range [minAngle, minAngle + (2 * Math.PI)).
 */
function normalizeAngle(angle, minAngle=0) {
  while (angle < minAngle) {
    angle += 2 * Math.PI;
  }

  while (angle >= minAngle + (2 * Math.PI)) {
    angle -= 2 * Math.PI;
  }

  return angle;
}

export default normalizeAngle;
