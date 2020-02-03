/**
 * @param {Array<number|null>} parters The partners notation.
 * 
 * @throws {Error} If an element in the partners notation is neither a number nor null.
 * @throws {Error} If the entries for any two positions are inconsistent with one another.
 */
function validatePartners(partners) {
  for (let p = 1; p <= partners.length; p++) {
    let q = partners[p - 1];

    if (typeof(q) !== 'number' && q !== null) {
      throw new Error('Unrecognized type in partners notation at position: ' + p + '.');
    }

    if (q !== null && partners[q - 1] !== p) {
      throw new Error('Inconsistent partners for positions: ' + p + ' and ' + q + '.');
    }
  }
}

export default validatePartners;
