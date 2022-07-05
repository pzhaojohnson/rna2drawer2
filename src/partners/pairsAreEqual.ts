import { Pair } from 'Partners/pairs/Pair';
import { upstreamPartner } from 'Partners/pairs/Pair';
import { downstreamPartner } from 'Partners/pairs/Pair';

export function pairsAreEqual(pair1: Pair, pair2: Pair): boolean {
  return (
    upstreamPartner(pair1) == upstreamPartner(pair2)
    && downstreamPartner(pair1) == downstreamPartner(pair2)
  );
}
