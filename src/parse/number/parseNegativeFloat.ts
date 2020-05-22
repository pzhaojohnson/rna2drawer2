import parseNonemptyFloat from './parseNonemptyFloat';

/**
 * Returns null if the given string cannot be parsed as
 * a negative floating point number.
 */
function parseNegativeFloat(s: string): number | null {
  let n = parseNonemptyFloat(s);
  if (!n) {
    return null;
  }
  if (n >= 0) {
    return null;
  }
  return n;
}

export default parseNegativeFloat;
