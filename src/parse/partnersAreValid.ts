/**
 * Returns false if:
 *  Any element in the array is not a number or null.
 *  Any number is not an integer.
 *  A partner is out of bounds.
 *  The partners for two positions disagree with one another.
 */
function partnersAreValid(partners: (number | null)[]): boolean {
  for (let p = 1; p <= partners.length; p++) {
    let q = partners[p - 1];
    if (typeof(q) !== 'number' && q !== null) {
      return false;
    }
    if (typeof(q) === 'number' && !Number.isInteger(q)) {
      return false;
    }
    if (typeof(q) === 'number' && (q < 1 || q > partners.length)) {
      return false;
    }
    if (typeof(q) === 'number' && partners[q - 1] !== p) {
      return false;
    }
  }
  return true;
}

export {
  partnersAreValid,
};
