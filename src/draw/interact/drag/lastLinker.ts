import { Partners } from 'Partners/Partners';
import { Linker } from 'Partners/Linker';
import { createLinker } from 'Partners/Linker';
import { containingUnpairedRegion as linkerContainingPosition } from 'Partners/containing';

// returns the last linker of the structure
export function lastLinker(partners: Partners): Linker {
  let linker = linkerContainingPosition(partners, partners.length);

  // the last position must be paired or the structure is empty
  if (!linker) {
    linker = createLinker({
      upstreamBoundingPosition: partners.length,
      downstreamBoundingPosition: partners.length + 1,
    });
  }

  return linker;
}
