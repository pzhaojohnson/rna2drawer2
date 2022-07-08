import type { Stem } from 'Partners/stems/Stem';
import { pairsInStem } from 'Partners/stems/Stem';
import { upstreamPartner } from 'Partners/pairs/Pair';

/**
 * Returns the positions in the upstream side of the stem.
 */
export function upstreamSideOfStem(stem: Stem): number[] {
  return pairsInStem(stem).map(pair => upstreamPartner(pair));
}
