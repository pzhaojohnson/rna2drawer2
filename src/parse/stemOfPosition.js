function _parsePosition5(p, partners) {
  let q = partners[p - 1];
  let p5 = Math.min(p, q);
  let p3 = Math.max(p, q);
  while (p5 > 1 && partners[p5 - 2] === p3 + 1) {
    p5--;
    p3++;
  }
  return p5;
}

function _parsePositionTop5(p, partners) {
  let q = partners[p - 1];
  let p5 = Math.min(p, q);
  let p3 = Math.max(p, q);
  while (p5 < p3 - 2 && partners[p5] === p3 - 1) {
    p5++;
    p3--;
  }
  return p5;
}

/**
 * @typedef {Object} Stem 
 * @property {number} position5 The 5' most position of the stem.
 * @property {number} position3 The 3' most position of the stem.
 * @property {number} size The number of base pairs in the stem.
 */

/**
 * Returns null if the position is not in a stem.
 * 
 * @param {number} p 
 * @param {Array<number|null>} partners 
 * 
 * @returns {Stem|null} 
 */
function stemOfPosition(p, partners) {
  if (!partners[p - 1]) {
    return null;
  }
  let p5 = _parsePosition5(p, partners);
  let pt5 = _parsePositionTop5(p, partners);
  return {
    position5: p5,
    position3: partners[p5 - 1],
    size: pt5 - p5 + 1,
  };
}

export default stemOfPosition;
