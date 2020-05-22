import parseNonemptyFloat from './parseNonemptyFloat';

/**
 * Returns null if the string cannot be parsed as a
 * nonnegative floating point number.
 * 
 * @param {string} s 
 * 
 * @returns {number|null} 
 */
function parseNonnegativeFloat(s) {
  let n = parseNonemptyFloat(s);
  if (!n && n !== 0) {
    return null;
  }
  if (n < 0) {
    return null;
  }
  return n;
}

export default parseNonnegativeFloat;
