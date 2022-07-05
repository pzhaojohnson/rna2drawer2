import type { StrictDrawing } from 'Draw/strict/StrictDrawing';
import { addTertiaryBond } from 'Draw/bonds/curved/add';
import { removeTertiaryBonds } from 'Draw/strict/removeTertiaryBonds';

import type { Partners } from 'Partners/Partners';
import { pairsInPartners } from 'Partners/pairs/pairsInPartners';

export type TertiarySubstructure = {

  // specifies the pairs in the tertiary substructure
  partners: Partners;

  // the start position of the tertiary substructure
  // in the layout sequence of the strict drawing
  startPosition: number;
};

export type Options = {

  // when set to false, preexisting tertiary bonds binding bases
  // in the substructure are not removed
  // (is treated as if set to true when left unspecified)
  removeTertiaryBonds?: boolean;
};

export function applyTertiarySubstructure(strictDrawing: StrictDrawing, substructure: TertiarySubstructure, options?: Options) {
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

  if (options?.removeTertiaryBonds ?? true) {
    removeTertiaryBonds(
      strictDrawing,
      strictDrawing.drawing.tertiaryBonds.filter(bond => (
        bases.has(bond.base1) || bases.has(bond.base2)
      )),
    );
  }

  pairsInPartners(substructure.partners).forEach(pair => {
    let b1 = sequence.atPosition(pair[0] + startPosition - 1);
    let b2 = sequence.atPosition(pair[1] + startPosition - 1);
    if (b1 && b2) {
      addTertiaryBond(strictDrawing.drawing, b1, b2);
    }
  });
}
