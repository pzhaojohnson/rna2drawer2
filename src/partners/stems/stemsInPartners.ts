import type { Partners } from 'Partners/Partners';

import type { Pair } from 'Partners/pairs/Pair';
import { upstreamPartner } from 'Partners/pairs/Pair';
import { downstreamPartner } from 'Partners/pairs/Pair';
import { pairsInPartners } from 'Partners/pairs/pairsInPartners';

import type { Stem } from 'Partners/stems/Stem';
import { createStem } from 'Partners/stems/Stem';

/**
 * Returns true if the two pairs are in the same stem
 * and immediately neighbor each other (i.e., there are
 * no other pairs between them). Returns false otherwise.
 *
 * Also returns false if either of the two pairs arguments
 * is undefined. (This behavior exists just in case values
 * of undefined are not being properly filtered out before
 * being input to this function.)
 */
function pairsAreStacked(pair1?: Pair, pair2?: Pair): boolean {
  if (!pair1 || !pair2) {
    return false;
  }

  if (upstreamPartner(pair1) > upstreamPartner(pair2)) {
    let temp = pair1;
    pair1 = pair2;
    pair2 = temp;
  }

  return (
    upstreamPartner(pair1) == upstreamPartner(pair2) - 1
    && downstreamPartner(pair1) == downstreamPartner(pair2) + 1
  );
}

// returns all stems formed by the pairs in the partners notation
export function stemsInPartners(partners: Partners): Stem[] {
  let pairs = pairsInPartners(partners);

  // sort in ascending order by upstream partner
  pairs.sort((pair1, pair2) => upstreamPartner(pair1) - upstreamPartner(pair2));

  let stems: Stem[] = [];

  let i = 0;
  while (i < pairs.length) {
    let bottomPair = pairs[i];
    let numPairs = 1;

    let prevPair = bottomPair;
    let nextPair: Pair | undefined = pairs[i + numPairs];
    while (nextPair && pairsAreStacked(prevPair, nextPair)) {
      prevPair = nextPair;
      numPairs++;
      nextPair = pairs[i + numPairs];
    }

    stems.push(createStem({ bottomPair, numPairs }));

    // use Math.max to ensure no infinite looping
    i += Math.max(numPairs, 1);
  }

  return stems;
}
