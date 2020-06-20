/**
 * Throws if an element in the partners notation is neither a number nor null.
 * Throws if the entries for any two positions are inconsistent with one another.
 */
function validatePartners(partners: (number | null)[]): (void | never) {
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
