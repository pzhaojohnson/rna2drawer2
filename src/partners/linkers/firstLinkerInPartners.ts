import type { Partners } from 'Partners/Partners';
import type { Linker } from 'Partners/linkers/Linker';
import { createLinker } from 'Partners/linkers/Linker';
import { containingLinker } from 'Partners/linkers/containingLinker';

/**
 * Returns the first linker in the structure.
 */
export function firstLinkerInPartners(partners: Partners): Linker {
  let firstLinker = containingLinker(partners, { position: 1 });
  if (firstLinker) {
    return firstLinker;
  } else {
    // either the first position is in a stem or the partners notation has a length of zero
    return createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 1 });
  }
}
