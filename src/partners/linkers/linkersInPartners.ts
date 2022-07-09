import type { Partners } from 'Partners/Partners';
import { areUnstructured } from 'Partners/areUnstructured';

import { stemsInPartners } from 'Partners/stems/stemsInPartners';
import { bottomPair } from 'Partners/stems/Stem';
import { topPair } from 'Partners/stems/Stem';
import { upstreamPartner } from 'Partners/pairs/Pair';
import { downstreamPartner } from 'Partners/pairs/Pair';

import { Linker } from 'Partners/linkers/Linker';
import { createLinker } from 'Partners/linkers/Linker';
import { upstreamBoundingPosition as upstreamBoundingPositionOfLinker } from 'Partners/linkers/Linker';
import { downstreamBoundingPosition as downstreamBoundingPositionOfLinker } from 'Partners/linkers/Linker';

/**
 * One side of a stem.
 */
type StemSide = {
  startPosition: number;
  endPosition: number;
}

/**
 * Returns an array of all linkers in the structure.
 */
export function linkersInPartners(partners: Partners): Linker[] {
  if (partners.length == 0) {
    return [];
  } else if (areUnstructured(partners)) {
    let upstreamBoundingPosition = 0;
    let downstreamBoundingPosition = partners.length + 1;
    return [createLinker({ upstreamBoundingPosition, downstreamBoundingPosition })];
  }

  let stems = stemsInPartners(partners);

  let upstreamStemSides = stems.map(stem => ({
    startPosition: upstreamPartner(bottomPair(stem)),
    endPosition: upstreamPartner(topPair(stem)),
  }));

  let downstreamStemSides = stems.map(stem => ({
    startPosition: downstreamPartner(topPair(stem)),
    endPosition: downstreamPartner(bottomPair(stem)),
  }));

  let stemSides = upstreamStemSides.concat(downstreamStemSides);

  // sort in ascending order by start position
  stemSides.sort((side1, side2) => side1.startPosition - side2.startPosition);

  let linkers: Linker[] = [];

  let prevStemSide: StemSide | undefined = undefined;
  stemSides.forEach(currStemSide => {
    let upstreamBoundingPosition = !prevStemSide ? 0 : prevStemSide.endPosition;
    let downstreamBoundingPosition = currStemSide.startPosition;
    linkers.push(createLinker({ upstreamBoundingPosition, downstreamBoundingPosition}));
    prevStemSide = currStemSide;
  });

  // add the last linker
  if (stemSides.length > 0) {
    let lastStemSide = stemSides[stemSides.length - 1];
    let upstreamBoundingPosition = lastStemSide.endPosition;
    let downstreamBoundingPosition = partners.length + 1;
    linkers.push(createLinker({ upstreamBoundingPosition, downstreamBoundingPosition}));
  }

  // remove empty linkers at beginning and end if present
  linkers = linkers.filter(linker => (
    downstreamBoundingPositionOfLinker(linker) != 1
    && upstreamBoundingPositionOfLinker(linker) != partners.length
  ));

  return linkers;
}
