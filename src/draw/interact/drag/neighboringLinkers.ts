import { Partners } from 'Partners/Partners';
import { Stem } from 'Partners/stems/Stem';
import { Linker } from 'Partners/linkers/Linker';

import { upstreamNeighboringLinker } from 'Partners/stems/neighboringLinkers';
import { downstreamNeighboringLinker } from 'Partners/stems/neighboringLinkers';

// returns the linker immediately before the stem
export function leadingLinker(partners: Partners, stem: Stem): Linker {
  return upstreamNeighboringLinker(partners, { stem });
}

// returns the linker immediately after the stem
export function trailingLinker(partners: Partners, stem: Stem): Linker {
  return downstreamNeighboringLinker(partners, { stem });
}
