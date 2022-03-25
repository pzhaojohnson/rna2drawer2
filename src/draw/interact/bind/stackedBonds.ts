import type { StrictDrawing } from 'Draw/strict/StrictDrawing';
import type { Base } from 'Draw/bases/Base';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { isSecondaryBond } from './isSecondaryBond';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
import { isTertiaryBond } from './isTertiaryBond';

export type StackableBond = SecondaryBond | TertiaryBond;

// returns the secondary and tertiary bonds that are stacked with the given
// bond with regards to the positions of bound bases in the layout sequence
// of the strict drawing
export function stackedBonds(strictDrawing: StrictDrawing, bond: StackableBond): Set<StackableBond> {
  let sequence = strictDrawing.layoutSequence();
  let basePositions = new Map<Base, number>();
  sequence.bases.forEach((base, i) => {
    let p = i + 1;
    basePositions.set(base, p);
  });

  let position1 = basePositions.get(bond.base1);
  let position2 = basePositions.get(bond.base2);
  if (position1 == undefined || position2 == undefined) {
    return new Set(); // unable to find the positions bound by the given bond
  }

  let all = [
    ...strictDrawing.drawing.secondaryBonds,
    ...strictDrawing.drawing.tertiaryBonds,
  ];

  let stacked = new Set<StackableBond>();

  let p1 = position1 + 1;
  let p2 = position2 - 1;
  let done = false;
  while (p1 <= sequence.length && p2 >= 1 && !done) {
    let b1 = sequence.atPosition(p1);
    let b2 = sequence.atPosition(p2);
    let binding = all.filter(bond => (
      b1 && b2 && bond.binds(b1) && bond.binds(b2)
    ));
    if (binding.length == 0) {
      done = true;
    } else {
      binding.forEach(bond => stacked.add(bond));
    }
    p1++;
    p2--;
  }

  p1 = position1 - 1;
  p2 = position2 + 1;
  done = false;
  while (p1 >= 1 && p2 <= sequence.length && !done) {
    let b1 = sequence.atPosition(p1);
    let b2 = sequence.atPosition(p2);
    let binding = all.filter(bond => (
      b1 && b2 && bond.binds(b1) && bond.binds(b2)
    ));
    if (binding.length == 0) {
      done = true;
    } else {
      binding.forEach(bond => stacked.add(bond));
    }
    p1--;
    p2++;
  }

  return stacked;
}

export function stackedSecondaryBonds(strictDrawing: StrictDrawing, bond: StackableBond): Set<SecondaryBond> {
  let stacked = Array.from(stackedBonds(strictDrawing, bond));
  return new Set(
    stacked.filter((bond): bond is SecondaryBond => isSecondaryBond(bond))
  );
}

export function stackedTertiaryBonds(strictDrawing: StrictDrawing, bond: StackableBond): Set<TertiaryBond> {
  let stacked = Array.from(stackedBonds(strictDrawing, bond));
  return new Set(
    stacked.filter((bond): bond is TertiaryBond => isTertiaryBond(bond))
  );
}
