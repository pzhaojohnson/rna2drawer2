/**
 * The given string is split by \s, and empty substrings are filtered
 * out of the split results.
 * 
 * @param {string} s 
 * 
 * @returns {Array<string>} 
 */
function nonemptySplitByWhitespace(s) {
  return s.split(/\s/).filter(ss => ss.length > 0);
}

export {
  nonemptySplitByWhitespace,
};
