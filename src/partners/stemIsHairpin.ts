import { Partners } from 'Partners/Partners';
import { Stem } from 'Partners/Stem';
import { topPair as topPairOfStem } from 'Partners/Stem';
import { upstreamPartner } from 'Partners/Pair';
import { downstreamPartner } from 'Partners/Pair';
import { containingUnpairedRegion as containingLinker } from 'Partners/containing';
import { downstreamBoundingPosition } from 'Partners/Linker';

export function stemIsHairpin(partners: Partners, stem: Stem): boolean {
  let topPair = topPairOfStem(stem);

  if (upstreamPartner(topPair) == downstreamPartner(topPair) - 1) {
    return true; // loop of size zero
  }

  let linker = containingLinker(partners, upstreamPartner(topPair) + 1);

  if (!linker) {
    return false; // the first enclosed position is paired
  }

  return downstreamBoundingPosition(linker) == downstreamPartner(topPair);
}
