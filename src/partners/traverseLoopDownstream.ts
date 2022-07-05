import { Partners } from 'Partners/Partners';
import { partnerOf } from 'Partners/Partners';

import { Stem } from 'Partners/Stem';
import { topPair } from 'Partners/Stem';
import { upstreamPartner } from 'Partners/pairs/Pair';
import { downstreamPartner } from 'Partners/pairs/Pair';

export type Traversed = {

  // the positions traversed in the order they were traversed
  positions: number[];
};

// Traverses the loop enclosed by the given stem in the 5' to 3' direction
// and returns what is traversed.
//
// When no closing stem is provided, the outermost loop is traversed.
//
// This function can traverse knots, though it is not guaranteed to take any
// particular path when there are knots.
export function traverseLoopDownstream(partners: Partners, closingStem?: Stem): Traversed {
  let traversed: Traversed = {
    positions: [],
  };

  if (partners.length == 0) {
    return traversed;
  }

  if (closingStem) {
    traversed.positions.push(upstreamPartner(topPair(closingStem)));
  }

  let start = !closingStem ? 1 : upstreamPartner(topPair(closingStem)) + 1;
  let end = !closingStem ? partners.length : downstreamPartner(topPair(closingStem)) - 1;

  let p = start;
  while (p <= end) {
    traversed.positions.push(p);
    let q = partnerOf(partners, p);
    if (q == undefined) {
      p++;
    } else if (q > p && q <= end) {
      p = q;
    } else {
      p++;
    }
  }

  if (closingStem) {
    traversed.positions.push(downstreamPartner(topPair(closingStem)));
  }

  return traversed;
}

export function traverseOutermostLoopDownstream(partners: Partners): Traversed {
  return traverseLoopDownstream(partners);
}
