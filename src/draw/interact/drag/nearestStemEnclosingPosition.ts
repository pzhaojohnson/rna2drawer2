import { Partners } from 'Partners/Partners';
import { Stem } from 'Partners/stems/Stem';
import { topPair } from 'Partners/stems/Stem';
import { upstreamPartner } from 'Partners/pairs/Pair';
import { stemsInPartners } from 'Partners/stems/stemsInPartners';
import { stemEnclosesPosition } from 'Partners/stems/stemEnclosesPosition';
import { compareNumbers } from 'Array/sort';

// returns the nearest stem enclosing the given position or undefined
// if no stems enclose the given position
// (assumes that the structure is a graphical tree where loops are vertices
// and stems are edges)
export function nearestStemEnclosingPosition(treeStructure: Partners, position: number): Stem | undefined {
  let enclosing = stemsInPartners(treeStructure).filter(stem => stemEnclosesPosition(stem, position));

  enclosing.sort((a, b) => compareNumbers(
    Math.abs(upstreamPartner(topPair(a)) - position),
    Math.abs(upstreamPartner(topPair(b)) - position),
  ));

  return enclosing[0];
}
