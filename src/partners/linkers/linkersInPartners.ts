import { Partners } from 'Partners/Partners';
import type { Linker } from 'Partners/linkers/Linker';
import { areUnstructured } from 'Partners/areUnstructured';
import { containingStem } from 'Partners/containing';
import { atIndex } from 'Array/at';

// represents one side of a stem
type StemSide = {
  mostUpstreamPosition: number;
  mostDownstreamPosition: number;
}

// returns all linkers formed by the partners notation
export function linkersInPartners(partners: Partners): Linker[] {
  if (partners.length == 0) {
    return [];
  } else if (areUnstructured(partners)) {
    return [{ boundingPosition5: 0, boundingPosition3: partners.length + 1 }];
  }

  let stemSides: StemSide[] = [];
  let p = 1;
  while (p <= partners.length) {
    let st = containingStem(partners, p);
    if (!st) { // position is unpaired
      p++;
    } else {
      stemSides.push({
        mostUpstreamPosition: p,
        mostDownstreamPosition: p + st.size - 1,
      });
      p = Math.max(
        p + st.size,
        p + 1, // just in case to prevent infinite looping
      );
    }
  }

  let linkers: Linker[] = [];
  let prevStemSide: StemSide | undefined = undefined;
  stemSides.forEach(currStemSide => {
    linkers.push({
      boundingPosition5: !prevStemSide ? 0 : prevStemSide.mostDownstreamPosition,
      boundingPosition3: currStemSide.mostUpstreamPosition,
    });
    prevStemSide = currStemSide;
  });
  let lastStemSide = atIndex(stemSides, stemSides.length - 1);
  if (lastStemSide) {
    linkers.push({
      boundingPosition5: lastStemSide.mostDownstreamPosition,
      boundingPosition3: partners.length + 1,
    });
  }

  // remove empty linkers at beginning and end
  linkers = linkers.filter(linker => (
    linker.boundingPosition3 != 1
    && linker.boundingPosition5 != partners.length
  ));

  return linkers;
}
