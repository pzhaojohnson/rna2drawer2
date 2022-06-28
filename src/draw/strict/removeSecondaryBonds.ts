import type { StrictDrawing } from 'Draw/strict/StrictDrawing';
import type { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { removeSecondaryBondById } from 'Draw/bonds/straight/remove';
import { unpair as unpairInPartners } from 'Partners/edit';
import { willUnpair } from 'Draw/strict/layout/stemProps';
import { evenOutLinkers } from 'Draw/strict/evenOutLinkers';

export type Options = {
  /**
   * Whether to update the layout of the drawing.
   * (The layout is updated if left unspecified.)
   */
  updateLayout?: boolean;
};

export function removeSecondaryBonds(strictDrawing: StrictDrawing, secondaryBonds: SecondaryBond[], options?: Options) {
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
  evenOutLinkers(strictDrawing, { updateLayout: false });

  if (options?.updateLayout ?? true) {
    strictDrawing.updateLayout();
  }
}
