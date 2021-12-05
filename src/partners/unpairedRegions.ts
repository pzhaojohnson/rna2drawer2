import { Partners } from 'Partners/Partners';
import { UnpairedRegion } from 'Partners/UnpairedRegion';
import { areUnstructured } from 'Partners/areUnstructured';
import { containingStem } from 'Partners/containing';
import { atIndex } from 'Array/at';

// represents one side of a stem
type StemSide = {
  mostUpstreamPosition: number;
  mostDownstreamPosition: number;
}

// returns all unpaired regions formed by the partners notation
export function unpairedRegions(partners: Partners): UnpairedRegion[] {
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
  
  let urs: UnpairedRegion[] = [];
  let prevStemSide: StemSide | undefined = undefined;
  stemSides.forEach(currStemSide => {
    urs.push({
      boundingPosition5: !prevStemSide ? 0 : prevStemSide.mostDownstreamPosition,
      boundingPosition3: currStemSide.mostUpstreamPosition,
    });
    prevStemSide = currStemSide;
  });
  let lastStemSide = atIndex(stemSides, stemSides.length - 1);
  if (lastStemSide) {
    urs.push({
      boundingPosition5: lastStemSide.mostDownstreamPosition,
      boundingPosition3: partners.length + 1,
    });
  }

  // remove empty unpaired regions at beginning and end
  urs = urs.filter(ur => (
    ur.boundingPosition3 != 1
    && ur.boundingPosition5 != partners.length
  ));

  return urs;
}
