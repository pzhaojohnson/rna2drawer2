import isAllWhitespace from '../isAllWhitespace';

/**
 * Returns null if the string cannot be parsed as a
 * nonnegative floating point number.
 * 
 * @param {string} s 
 * 
 * @returns {number|null} 
 */
function parseNonnegativeFloat(s) {
  if (isAllWhitespace(s)) {
    return null;
  }
  let n = Number(s);
  if (!Number.isFinite(n)) {
    return null;
  }
  if (n < 0) {
    return null;
  }
  return n;
}

export default parseNonnegativeFloat;
