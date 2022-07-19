import type { StrictDrawing } from 'Draw/strict/StrictDrawing';

import type { Base } from 'Draw/bases/Base';

import { Side } from './Side';
import { sidesOverlap } from './Side';

import { secondaryBondsBindingSide } from './bondsBindingSide';
import { pair as pairInPartners } from 'Partners/edit';
import { isTree } from 'Partners/isTree';
import { willPair } from 'Draw/strict/layout/stemProps';

import { addSecondaryBond } from 'Draw/bonds/straight/add';
import { addTertiaryBond } from 'Draw/bonds/curved/add';

// returns true if the two sides are nonempty and can be bound
// together evenly
export function canBind(side1: Side, side2: Side): boolean {
  return (
    side1.length == side2.length
    && side1.length > 0
    && !sidesOverlap(side1, side2)
  );
}

export function canBindWithSecondaryBonds(strictDrawing: StrictDrawing, side1: Side, side2: Side): boolean {
  if (!canBind(side1, side2)) {
    return false;
  }

  let binding1 = secondaryBondsBindingSide(strictDrawing, side1);
  let binding2 = secondaryBondsBindingSide(strictDrawing, side2);
  if (binding1.length > 0 || binding2.length > 0) {
    return false;
  }

  let sequence = strictDrawing.layoutSequence();
  let p1 = sequence.positionOf(side1[0]);
  let p2 = sequence.positionOf(side2[side2.length - 1]);

  let partners = strictDrawing.layoutPartners();
  for (let i = 0; i < side1.length; i++) {
    pairInPartners(partners, p1, p2);
    p1++;
    p2--;
  }
  return isTree(partners);
}

// does nothing if unable to bind the two sides with secondary bonds
export function bindWithSecondaryBonds(strictDrawing: StrictDrawing, side1: Side, side2: Side) {
  if (!canBindWithSecondaryBonds(strictDrawing, side1, side2)) {
    console.error('Unable to bind the two sides with secondary bonds.');
    return;
  } else if (side1.length == 0 || side2.length == 0) {
    return; // there are no secondary bonds to add
  }

  let sequence = strictDrawing.layoutSequence();
  let partners = strictDrawing.layoutPartners();
  let perBaseLayoutProps = strictDrawing.perBaseLayoutProps();

  let start1 = sequence.positionOf(side1[0]);
  let end1 = start1 + side1.length - 1;
  let start2 = sequence.positionOf(side2[0]);
  let end2 = start2 + side2.length - 1;

  willPair(
    partners,
    perBaseLayoutProps,
    { start: start1, end: end1 },
    { start: start2, end: end2 },
  );

  for (let i = 0; i < side1.length; i++) {
    let base1: Base | undefined = side1[i];
    let base2: Base | undefined = side2[side2.length - i - 1];
    if (base1 && base2) { // check if undefined just to be safe
      addSecondaryBond(strictDrawing.drawing, base1, base2);
    }
  }

  strictDrawing.setPerBaseLayoutProps(perBaseLayoutProps);
  strictDrawing.updateLayout();
}

// does nothing if unable to bind the two sides with tertiary bonds
export function bindWithTertiaryBonds(strictDrawing: StrictDrawing, side1: Side, side2: Side) {
  if (!canBind(side1, side2)) {
    console.error('Unable to bind the two sides with tertiary bonds.');
    return;
  } else if (side1.length == 0 || side2.length == 0) {
    return; // there are no tertiary bonds to add
  }

  for (let i = 0; i < side1.length; i++) {
    let base1: Base | undefined = side1[i];
    let base2: Base | undefined = side2[side2.length - i - 1];
    if (base1 && base2) { // check if undefined just to be safe
      addTertiaryBond(strictDrawing.drawing, base1, base2);
    }
  }
}
