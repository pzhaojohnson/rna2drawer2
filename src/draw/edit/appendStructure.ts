import { DrawingInterface as Drawing } from '../DrawingInterface';
import { BaseInterface as Base } from '../BaseInterface';

export interface Structure {
  id: string;
  characters: string;
  secondaryPartners?: (number | null)[];
  tertiaryPartners?: (number | null)[];
}

function _checkPartnersLengths(structure: Structure) {
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

function _appendSequence(drawing: Drawing, structure: Structure) {
  let seq = drawing.appendSequenceOutOfView(
    structure.id,
    structure.characters,
  );
  if (!seq) {
    return false;
  }
  return true;
}

function _addPrimaryBonds(drawing: Drawing, structure: Structure) {
  let seq = drawing.getSequenceById(structure.id);
  seq.forEachBase((b: Base, p: number) => {
    if (p < seq.length) {
      drawing.addPrimaryBond(
        seq.getBaseAtPosition(p),
        seq.getBaseAtPosition(p + 1),
      );
    }
  });
}

function _addSecondaryBonds(drawing: Drawing, structure: Structure) {
  if (!structure.secondaryPartners) {
    return;
  }
  let seq = drawing.getSequenceById(structure.id);
  seq.forEachBase((b: Base, p: number) => {
    let q = structure.secondaryPartners[p - 1];
    if (q != null && p < q) {
      drawing.addSecondaryBond(
        seq.getBaseAtPosition(p),
        seq.getBaseAtPosition(q),
      );
    }
  });
}

function _addTertiaryBonds(drawing: Drawing, structure: Structure) {
  if (!structure.tertiaryPartners) {
    return;
  }
  let seq = drawing.getSequenceById(structure.id);
  seq.forEachBase((b: Base, p: number) => {
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
 * The structure is not appended if the sequence cannot be appended (e.g. the
 * sequence ID is already taken), or if the lengths of the secondary or tertiary
 * partners do not match the length of the sequence.
 * 
 * Returns true if the structure was successfully appended.
 */
export function appendStructure(drawing: Drawing, structure: Structure) {
  if (!_checkPartnersLengths(structure)) {
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
