/**
 * The given string is split by \s, and empty substrings are filtered
 * out of the split results.
 */
function nonemptySplitByWhitespace(s: string): string[] {
  return s.split(/\s/).filter(ss => ss.length > 0);
}

export {
  nonemptySplitByWhitespace,
};
