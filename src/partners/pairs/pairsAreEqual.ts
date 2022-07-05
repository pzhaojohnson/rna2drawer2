import { Pair } from 'Partners/pairs/Pair';
import { upstreamPartner } from 'Partners/pairs/Pair';
import { downstreamPartner } from 'Partners/pairs/Pair';

/**
 * Returns true if the two pairs have the same upstream
 * and downstream partners and false otherwise.
 */
export function pairsAreEqual(pair1: Pair, pair2: Pair): boolean {
  return (
    upstreamPartner(pair1) == upstreamPartner(pair2)
    && downstreamPartner(pair1) == downstreamPartner(pair2)
  );
}
