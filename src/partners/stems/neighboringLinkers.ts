import type { Partners } from 'Partners/Partners';

import type { Stem } from 'Partners/stems/Stem';
import { bottomPair } from 'Partners/stems/Stem';
import { upstreamPartner } from 'Partners/pairs/Pair';
import { downstreamPartner } from 'Partners/pairs/Pair';

import type { Linker } from 'Partners/linkers/Linker';
import { createLinker } from 'Partners/linkers/Linker';
import { containingLinker } from 'Partners/linkers/containingLinker';

export type Args = { stem: Stem };

export function upstreamNeighboringLinker(partners: Partners, args: Args): Linker {
  let p = upstreamPartner(bottomPair(args.stem));

  if (p == 1) {
    return createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 1 });
  }

  let linker = containingLinker(partners, { position: p - 1 });

  if (linker) {
    return linker;
  }

  // the position immediately upstream of the stem is in another stem
  return createLinker({ upstreamBoundingPosition: p - 1, downstreamBoundingPosition: p });
}

export function downstreamNeighboringLinker(partners: Partners, args: Args): Linker {
  let p = downstreamPartner(bottomPair(args.stem));

  if (p == partners.length) {
    let upstreamBoundingPosition = partners.length;
    let downstreamBoundingPosition = partners.length + 1;
    return createLinker({ upstreamBoundingPosition, downstreamBoundingPosition });
  }

  let linker = containingLinker(partners, { position: p + 1 });

  if (linker) {
    return linker;
  }

  // the position immediately downstream of the stem is in another stem
  return createLinker({ upstreamBoundingPosition: p, downstreamBoundingPosition: p + 1 });
}
