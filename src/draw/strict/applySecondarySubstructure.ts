import type { StrictDrawing } from 'Draw/strict/StrictDrawing';
import { addSecondaryBond } from 'Draw/bonds/straight/add';
import { removeSecondaryBonds } from 'Draw/strict/removeSecondaryBonds';
import { radiateSubstructure } from 'Draw/strict/radiateSubstructure';
import { evenOutLinkers } from 'Draw/strict/evenOutLinkers';

import type { Partners } from 'Partners/Partners';
import { pairs as pairsInPartners } from 'Partners/pairs';

export type SecondarySubstructure = {

  // specifies the pairs in the secondary substructure
  partners: Partners;

  // the start position of the secondary substructure
  // in the layout sequence of the strict drawing
  startPosition: number;
};

export function applySecondarySubstructure(strictDrawing: StrictDrawing, substructure: SecondarySubstructure) {
  if (substructure.partners.length == 0) {
    return;
  }

  let sequence = strictDrawing.layoutSequence();

  let startPosition = substructure.startPosition;
  let endPosition = startPosition + substructure.partners.length - 1;

  // the bases of the substructure
  let bases = new Set(
    sequence.bases.slice(startPosition - 1, endPosition)
  );

  removeSecondaryBonds(
    strictDrawing,
    strictDrawing.drawing.secondaryBonds.filter(bond => (
      bases.has(bond.base1) || bases.has(bond.base2)
    )),
    { updateLayout: false },
  );

  pairsInPartners(substructure.partners).forEach(pair => {
    let b1 = sequence.atPosition(pair[0] + startPosition - 1);
    let b2 = sequence.atPosition(pair[1] + startPosition - 1);
    if (b1 && b2) {
      addSecondaryBond(strictDrawing.drawing, b1, b2);
    }
  });

  radiateSubstructure(strictDrawing, { startPosition, endPosition }, { updateLayout: false });
  evenOutLinkers(strictDrawing, { updateLayout: true });
}
