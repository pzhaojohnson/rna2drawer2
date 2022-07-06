import { Stem } from 'Partners/Stem';
import { pairs as pairsOfStem } from 'Partners/Stem';
import { downstreamPartner } from 'Partners/pairs/Pair';

/**
 * Returns the positions in the downstream side of the stem.
 */
export function downstreamSideOfStem(stem: Stem): number[] {
  return pairsOfStem(stem).map(pair => downstreamPartner(pair));
}
