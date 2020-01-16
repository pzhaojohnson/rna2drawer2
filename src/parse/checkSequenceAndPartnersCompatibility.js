/**
 * @param {string} sequence 
 * @param {Array<number|null>} partners The partners notation of the structure for the sequence.
 * 
 * @throws {Error} If the sequence and partners notation are different lengths.
 */
function checkSequenceAndPartnersCompatibility(sequence, partners) {
  if (sequence.length !== partners.length) {
    throw new Error('Sequence and structure are different lengths.');
  }
}

export default checkSequenceAndPartnersCompatibility;
