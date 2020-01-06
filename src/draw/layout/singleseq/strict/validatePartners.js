/**
 * @param {Array<number|null>} parters The partners notation.
 * 
 * @throws {Error} If the partners notation is invalid.
 */
function validatePartners(partners) {
  for (let p = 1; p <= partners.length; p++) {
    let q = partners[p - 1];

    if (q !== null && partners[q - 1] !== p) {
      throw new Error('Invalid partners notation.');
    }
  }
}

export default validatePartners;
