/**
 * @param {number} points 
 * 
 * @returns {number} 
 */
function pointsToPixels(points) {
  return (96 / 72) * points;
}

export {
  pointsToPixels,
};
