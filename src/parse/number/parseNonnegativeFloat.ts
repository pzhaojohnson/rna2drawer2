import parseNonemptyFloat from './parseNonemptyFloat';

/**
 * Returns null if the given string cannot be parsed as
 * a nonnegative floating point number.
 */
function parseNonnegativeFloat(s: string): number | null {
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
