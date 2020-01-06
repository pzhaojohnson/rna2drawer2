/**
 * @param {number} x0 
 * @param {number} y0 
 * @param {number} x1 
 * @param {number} y1
 * 
 * @returns {number} The angle from point 0 to point 1.
 */
function angleBetween(x0, y0, x1, y1) {
  let a = x1 - x0;
  let o = y1 - y0;
  return Math.atan2(o, a);
}

export default angleBetween;
