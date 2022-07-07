import { Stem } from 'Partners/stems/Stem';
import { pairsInStem } from 'Partners/stems/Stem';
import { downstreamPartner } from 'Partners/pairs/Pair';

/**
 * Returns the positions in the downstream side of the stem.
 */
export function downstreamSideOfStem(stem: Stem): number[] {
  return pairsInStem(stem).map(pair => downstreamPartner(pair));
}
