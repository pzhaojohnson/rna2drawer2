import type { StrictDrawing } from 'Draw/strict/StrictDrawing';

import type { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { unpair as unpairInPartners } from 'Partners/edit';
import { willUnpair } from 'Draw/strict/layout/stemProps';
import { removeSecondaryBondById } from 'Draw/bonds/straight/remove';

export function removeSecondaryBonds(strictDrawing: StrictDrawing, secondaryBonds: SecondaryBond[]) {
  let sequence = strictDrawing.layoutSequence();
  let partners = strictDrawing.layoutPartners();
  let perBaseLayoutProps = strictDrawing.perBaseLayoutProps();

  secondaryBonds.forEach(secondaryBond => {
    let p1 = sequence.positionOf(secondaryBond.base1);

    // update per base layout props
    willUnpair(partners, perBaseLayoutProps, { start: p1, end: p1 });

    // remove the secondary bond
    removeSecondaryBondById(strictDrawing.drawing, secondaryBond.id);

    unpairInPartners(partners, p1); // update partners notation
  });

  strictDrawing.setPerBaseLayoutProps(perBaseLayoutProps);
  strictDrawing.updateLayout();
}
