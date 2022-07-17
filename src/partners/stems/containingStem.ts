import type { Partners } from 'Partners/Partners';

import type { Stem } from 'Partners/stems/Stem';
import { createStem } from 'Partners/stems/Stem';

import { positionIsInRange } from 'Partners/range';

import { partnerOf } from 'Partners/Partners';
import { arePaired } from 'Partners/isPaired';

import { upstreamPartner } from 'Partners/pairs/Pair';
import { downstreamPartner } from 'Partners/pairs/Pair';

export type Args = (
  { position: number }
  | number // a position
);

/**
 * Returns the stem containing the given position
 * or undefined if the position is not in a stem.
 */
export function containingStem(partners: Partners, args: Args): Stem | undefined {
  let p = typeof args == 'number' ? args : args.position;

  if (!positionIsInRange(partners, p)) {
    return undefined;
  }

  let q = partnerOf(partners, p);

  if (q == undefined) {
    return undefined;
  }

  let up = upstreamPartner([p, q]);
  let dp = downstreamPartner([p, q]);
  while (up - 1 > 0 && dp + 1 <= partners.length && arePaired(partners, up - 1, dp + 1)) {
    up--;
    dp++;
  }
  let numPairs = 1;
  while (up + numPairs < dp - numPairs && arePaired(partners, up + numPairs, dp - numPairs)) {
    numPairs++;
  }
  return createStem({ bottomPair: [up, dp], numPairs });
}
