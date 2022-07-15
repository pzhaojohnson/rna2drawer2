import type { Partners } from 'Partners/Partners';
import type { Linker } from 'Partners/linkers/Linker';
import { createLinker } from 'Partners/linkers/Linker';
import { containingLinker } from 'Partners/linkers/containingLinker';

/**
 * Returns the last linker in the structure.
 */
export function lastLinkerInPartners(partners: Partners): Linker {
  let lastLinker = containingLinker(partners, { position: partners.length });
  if (lastLinker) {
    return lastLinker;
  } else {
    // either the last position is in a stem or the partners notation has a length of zero
    let upstreamBoundingPosition = partners.length;
    let downstreamBoundingPosition = partners.length + 1;
    return createLinker({ upstreamBoundingPosition, downstreamBoundingPosition });
  }
}
