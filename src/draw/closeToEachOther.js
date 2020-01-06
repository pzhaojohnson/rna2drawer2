/**
 * @param {number} x 
 * @param {number} y 
 * @param {number} maxDiff The maximum allowed difference between the two numbers.
 * 
 * @returns {boolean} True if the difference between the two numbers is
 *  less than or equal to the maximum allowed difference.
 */
function closeToEachOther(x, y, maxDiff) {
  return Math.abs(x - y) <= maxDiff;
}

export default closeToEachOther;
