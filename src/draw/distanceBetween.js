/**
 * @param {number} x0 
 * @param {number} y0 
 * @param {number} x1 
 * @param {number} y1 
 * 
 * @throws {number} The distance between two points.
 */
function distanceBetween(x0, y0, x1, y1) {
  return ((x1 - x0) ** 2 + (y1 - y0) ** 2) ** 0.5;
}

export default distanceBetween;
