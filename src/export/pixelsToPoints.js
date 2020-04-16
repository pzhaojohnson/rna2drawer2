/**
 * @param {number} pixels 
 * 
 * @returns {number} 
 */
function pixelsToPoints(pixels) {
  return (72 / 96) * pixels;
}

export {
  pixelsToPoints,
};
