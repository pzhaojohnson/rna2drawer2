import parseNonemptyFloat from './parseNonemptyFloat';

/**
 * Returns null if the given string cannot be parsed as
 * a nonpositive floating point number.
 */
function parseNonpositiveFloat(s: string): number | null {
  let n = parseNonemptyFloat(s);
  if (!n && n !== 0) {
    return null;
  }
  if (n > 0) {
    return null;
  }
  return n;
}

export default parseNonpositiveFloat;
