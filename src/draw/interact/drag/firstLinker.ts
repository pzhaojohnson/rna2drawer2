import { Partners } from 'Partners/Partners';
import { Linker } from 'Partners/Linker';
import { createLinker } from 'Partners/Linker';
import { containingUnpairedRegion as linkerContainingPosition } from 'Partners/containing';

// returns the first linker of the structure
export function firstLinker(partners: Partners): Linker {
  let linker = linkerContainingPosition(partners, 1);
  if (linker) {
    return linker;
  } else {
    // first position must be paired or the structure is empty
    return createLinker({ upstreamBoundingPosition: 0, downstreamBoundingPosition: 1 });
  }
}
