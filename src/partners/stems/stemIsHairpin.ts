import type { Partners } from 'Partners/Partners';

import type { Stem } from 'Partners/stems/Stem';
import { topPair as topPairOfStem } from 'Partners/stems/Stem';
import { upstreamPartner } from 'Partners/pairs/Pair';
import { downstreamPartner } from 'Partners/pairs/Pair';

import { containingLinker } from 'Partners/linkers/containingLinker';
import { downstreamBoundingPosition } from 'Partners/linkers/Linker';

/**
 * Returns true if every position between the two sides of the stem
 * is unpaired and false otherwise.
 *
 * This means that this function currently returns false if there are
 * any pseudoknots between the loop of the stem and positions not
 * enclosed by the stem. (This behavior is not firmly defined, though,
 * and may change in the future.)
 */
export function stemIsHairpin(partners: Partners, stem: Stem): boolean {
  let topPair = topPairOfStem(stem);

  if (upstreamPartner(topPair) == downstreamPartner(topPair) - 1) {
    return true; // no positions between the two sides of the stem
  }

  let linker = containingLinker(
    partners,
    { position: upstreamPartner(topPair) + 1 },
  );

  if (!linker) {
    return false;
  }

  return downstreamBoundingPosition(linker) == downstreamPartner(topPair);
}
