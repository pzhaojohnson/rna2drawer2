import isAllWhitespace from '../isAllWhitespace';

/**
 * Returns null if the given string is empty or all whitespace or
 * cannot be parsed as a floating point number.
 */
function parseNonemptyFloat(s: string): number | null {
  if (isAllWhitespace(s)) {
    return null;
  }
  let n = Number(s);
  if (!Number.isFinite(n)) {
    return null;
  }
  return n;
}

export default parseNonemptyFloat;
