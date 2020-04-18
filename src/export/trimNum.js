/**
 * @param {number} n 
 * @param {number} places Decimal places to trim the number to.
 * 
 * @returns {number} 
 */
function trimNum(n, places) {
  let trimmed = n.toFixed(places);
  return Number(trimmed);
}

export {
  trimNum,
};
