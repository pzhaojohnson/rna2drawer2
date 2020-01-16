/**
 * Returns true for an empty string.
 * 
 * @param {string} s 
 * 
 * @returns {boolean} True if the given string is all whitespace.
 */
function isAllWhitespace(s) {
  return s.trim().length === 0;
}

export default isAllWhitespace;
