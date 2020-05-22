import parseNonemptyFloat from './parseNonemptyFloat';

/**
 * Returns null if the given string cannot be parsed as
 * a positive floating point number.
 */
function parsePositiveFloat(s: string): number | null {
  let n = parseNonemptyFloat(s);
  if (!n) {
    return null;
  }
  if (n <= 0) {
    return null;
  }
  return n;
}

export default parsePositiveFloat;
