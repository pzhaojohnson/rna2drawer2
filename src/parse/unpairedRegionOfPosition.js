function _parseBoundingPosition5(p, partners) {
  while (p > 0 && !partners[p - 1]) {
    p--;
  }
  return p;
}

function _parseBoundingPosition3(p, partners) {
  while (p <= partners.length && !partners[p - 1]) {
    p++;
  }
  return p;
}

/**
 * @typedef {Object} UnpairedRegion 
 * @property {number} boundingPosition5 The 5' bounding position.
 * @property {number} boundingPosition3 The 3' bounding position.
 */

/**
 * Returns null if the position is not in an unpaired region.
 * 
 * @param {number} p 
 * @param {Array<number|null>} partners 
 * 
 * @returns {UnpairedRegion|null} 
 */
function unpairedRegionOfPosition(p, partners) {
  if (partners[p - 1]) {
    return null;
  }
  return {
    boundingPosition5: _parseBoundingPosition5(p, partners),
    boundingPosition3: _parseBoundingPosition3(p, partners),
  };
}

export default unpairedRegionOfPosition;
