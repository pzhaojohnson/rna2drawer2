function _checkPartnersLengths(drawing, structure) {
  let seqLength = structure.characters.length;
  if (structure.secondaryPartners) {
    let secondaryLength = structure.secondaryPartners.length;
    if (secondaryLength !== seqLength) {
      return false;
    }
  }
  if (structure.tertiaryPartners) {
    let tertiaryLength = structure.tertiaryPartners.length;
    if (tertiaryLength !== seqLength) {
      return false;
    }
  }
  return true;
}

function _appendSequence(drawing, structure) {
  let seq = drawing.appendSequenceOutOfView(
    structure.id,
    structure.characters,
  );
  if (!seq) {
    return false;
  }
  return true;
}

function _addPrimaryBonds(drawing, structure) {
  let seq = drawing.getSequenceById(structure.id);
  seq.forEachBase((b, p) => {
    if (p < seq.length) {
      drawing.addPrimaryBond(
        seq.getBaseAtPosition(p),
        seq.getBaseAtPosition(p + 1),
      );
    }
  });
}

function _addSecondaryBonds(drawing, structure) {
  if (!structure.secondaryPartners) {
    return;
  }
  let seq = drawing.getSequenceById(structure.id);
  seq.forEachBase((b, p) => {
    let q = structure.secondaryPartners[p - 1];
    if (q != null && p < q) {
      drawing.addSecondaryBond(
        seq.getBaseAtPosition(p),
        seq.getBaseAtPosition(q),
      );
    }
  });
}

function _addTertiaryBonds(drawing, structure) {
  if (!structure.tertiaryPartners) {
    return;
  }
  let seq = drawing.getSequenceById(structure.id);
  seq.forEachBase((b, p) => {
    let q = structure.tertiaryPartners[p - 1];
    if (q != null && p < q) {
      drawing.addTertiaryBond(
        seq.getBaseAtPosition(p),
        seq.getBaseAtPosition(q),
      );
    }
  });
}

/**
 * @typedef {Object} Structure 
 * @property {string} id 
 * @property {string} characters 
 * @property {Array<number|null>|undefined} secondaryPartners 
 * @property {Array<number|null>|undefined} tertiaryPartners 
 */

/**
 * The structure is not appended if the sequence cannot be appended (e.g. the
 * sequence ID is already taken), or if the lengths of the secondary or tertiary
 * partners do not match the length of the sequence.
 * 
 * @param {Drawing} drawing 
 * @param {Structure} structure 
 * 
 * @returns {boolean} True if the structure was successfully appended.
 */
function appendStructure(drawing, structure) {
  if (!_checkPartnersLengths(drawing, structure)) {
    return false;
  }
  if (!_appendSequence(drawing, structure)) {
    return false;
  }
  _addPrimaryBonds(drawing, structure);
  _addSecondaryBonds(drawing, structure);
  _addTertiaryBonds(drawing, structure);
  return true;
}

export default appendStructure;
