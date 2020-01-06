/**
 * This is not perfectly precise, as polar length really depends on the size of a given circle,
 * but this seems to work well enough in practice.
 * 
 * @param {number} length 
 * 
 * @returns {number} The polar length of a straight length.
 */
function polarizeLength(length) {
  return 1.15 * length;
}

export default polarizeLength;
