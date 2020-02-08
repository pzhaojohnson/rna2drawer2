/**
 * This is not perfectly precise, as polar length really depends on the size of a given circle,
 * but this seems to work well enough in practice.
 * 
 * @param {number} straightLength 
 * 
 * @returns {number} The polar length of a straight length.
 */
function polarizeLength(straightLength) {
  return 1.15 * straightLength;
}

export default polarizeLength;
