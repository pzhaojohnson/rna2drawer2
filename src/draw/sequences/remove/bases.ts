import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { PrimaryBondInterface as PrimaryBond } from 'Draw/bonds/straight/PrimaryBondInterface';
import { addPrimaryBond } from 'Draw/bonds/straight/add';
import { removePrimaryBondById, removeSecondaryBondById } from 'Draw/bonds/straight/remove';
import { removeTertiaryBondById } from 'Draw/bonds/curved/remove';
import { removeCircleOutline, removeCircleHighlighting } from 'Draw/bases/annotate/circle/add';
import { removeNumbering } from 'Draw/bases/number/add';
import { atPosition } from 'Array/at';
import { updateBaseNumberings } from 'Draw/sequences/updateBaseNumberings';
import { orientBaseNumberings } from 'Draw/bases/number/orient';

// removes all bonds with the bases
function removeBondsWith(drawing: Drawing, bs: Base[]) {
  let bonds = [
    ...drawing.primaryBonds,
    ...drawing.secondaryBonds,
    ...drawing.tertiaryBonds,
  ];
  let ids: string[] = [];
  let s = new Set(bs);
  bonds.forEach(bond => {
    if (s.has(bond.base1) || s.has(bond.base2)) {
      ids.push(bond.id);
    }
  });
  ids.forEach(id => {
    removePrimaryBondById(drawing, id);
    removeSecondaryBondById(drawing, id);
    removeTertiaryBondById(drawing, id);
  });
}

// removes the bases themselves
function _removeBases(drawing: Drawing, bs: Base[]) {
  bs.forEach(b => {
    let seq = drawing.sequences.find(seq => seq.bases.includes(b));
    if (!seq) {
      console.error(`No sequence contains the base with ID: ${b.id}.`);
    } else {
      let i = seq.bases.indexOf(b);
      // should be at least zero if the sequence was found above,
      // but check just to be safe
      if (i < 0) {
        console.error(`Unable to find the base with ID: ${b.id}.`);
      } else {
        seq.bases.splice(i, 1);
        b.text.remove();
        removeCircleOutline(b);
        removeCircleHighlighting(b);
        removeNumbering(b);
      }
    }
  });
}

// returns undefined if there is no primary bond between the two bases
function findPrimaryBondBetween(drawing: Drawing, b1: Base, b2: Base): PrimaryBond | undefined {
  return drawing.primaryBonds.find(
    pb => pb.binds(b1) && pb.binds(b2)
  );
}

function hasPrimaryBondBetween(drawing: Drawing, b1: Base, b2: Base): boolean {
  return findPrimaryBondBetween(drawing, b1, b2) ? true : false;
}

// adds missing primary bonds between consecutive bases in sequences
function addMissingPrimaryBonds(drawing: Drawing) {
  drawing.sequences.forEach(seq => {
    for (let p1 = 1; p1 < seq.bases.length; p1++) {
      let b1 = atPosition(seq.bases, p1);
      let b2 = atPosition(seq.bases, p1 + 1);
      if (b1 && b2 && !hasPrimaryBondBetween(drawing, b1, b2)) {
        addPrimaryBond(drawing, b1, b2);
      }
    }
  });
}

export function removeBases(drawing: Drawing, bs: Base[]) {
  removeBondsWith(drawing, bs);
  _removeBases(drawing, bs);
  addMissingPrimaryBonds(drawing);
  drawing.sequences.forEach(seq => {
    updateBaseNumberings(seq, {
      offset: seq.numberingOffset,
      increment: seq.numberingIncrement,
      anchor: seq.numberingAnchor,
    });
  });
  orientBaseNumberings(drawing);
}
