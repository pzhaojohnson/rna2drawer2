import { DrawingInterface as Drawing } from '../DrawingInterface';
import { BaseInterface as Base } from '../BaseInterface';
import { SequenceInterface as Sequence } from '../SequenceInterface';

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
  let seq = drawing.getSequenceById(structure.id) as Sequence;
  seq.forEachBase((b: Base, p: number) => {
    if (p < seq.length) {
      drawing.addPrimaryBond(
        seq.getBaseAtPosition(p) as Base,
        seq.getBaseAtPosition(p + 1) as Base,
      );
    }
  });
}

function _addSecondaryBonds(drawing: Drawing, structure: Structure) {
  if (!structure.secondaryPartners) {
    return;
  }
  let secondaryPartners = structure.secondaryPartners as (number | null)[];
  let seq = drawing.getSequenceById(structure.id) as Sequence;
  seq.forEachBase((b: Base, p: number) => {
    let q = secondaryPartners[p - 1];
    if (q != null && p < q) {
      drawing.addSecondaryBond(
        seq.getBaseAtPosition(p) as Base,
        seq.getBaseAtPosition(q) as Base,
      );
    }
  });
}

function _addTertiaryBonds(drawing: Drawing, structure: Structure) {
  if (!structure.tertiaryPartners) {
    return;
  }
  let tertiaryPartners = structure.tertiaryPartners as (number | null)[];
  let seq = drawing.getSequenceById(structure.id) as Sequence;
  seq.forEachBase((b: Base, p: number) => {
    let q = tertiaryPartners[p - 1];
    if (q != null && p < q) {
      drawing.addTertiaryBond(
        seq.getBaseAtPosition(p) as Base,
        seq.getBaseAtPosition(q) as Base,
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
