import { Pair } from 'Partners/Pair';
import { upstreamPartner } from 'Partners/Pair';
import { downstreamPartner } from 'Partners/Pair';

export function pairsAreEqual(pair1: Pair, pair2: Pair): boolean {
  return (
    upstreamPartner(pair1) == upstreamPartner(pair2)
    && downstreamPartner(pair1) == downstreamPartner(pair2)
  );
}
