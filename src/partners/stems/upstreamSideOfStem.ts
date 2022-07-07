import { Stem } from 'Partners/stems/Stem';
import { pairs as pairsOfStem } from 'Partners/stems/Stem';
import { upstreamPartner } from 'Partners/pairs/Pair';

/**
 * Returns the positions in the upstream side of the stem.
 */
export function upstreamSideOfStem(stem: Stem): number[] {
  return pairsOfStem(stem).map(pair => upstreamPartner(pair));
}
