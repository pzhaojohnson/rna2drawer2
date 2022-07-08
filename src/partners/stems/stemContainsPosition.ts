import type { Stem } from 'Partners/stems/Stem';

import { bottomPair } from 'Partners/stems/Stem';
import { topPair } from 'Partners/stems/Stem';

import { upstreamPartner } from 'Partners/pairs/Pair';
import { downstreamPartner } from 'Partners/pairs/Pair';

export function stemContainsPosition(stem: Stem, p: number): boolean {
  let isInUpstreamSide = (
    p >= upstreamPartner(bottomPair(stem))
    && p <= upstreamPartner(topPair(stem))
  );

  let isInDownstreamSide = (
    p >= downstreamPartner(topPair(stem))
    && p <= downstreamPartner(bottomPair(stem))
  );

  return isInUpstreamSide || isInDownstreamSide;
}
