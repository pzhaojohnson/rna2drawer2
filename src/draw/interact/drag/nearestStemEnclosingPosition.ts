import { Partners } from 'Partners/Partners';
import { Stem } from 'Partners/Stem';
import { topPair } from 'Partners/Stem';
import { upstreamPartner } from 'Partners/Pair';
import { stems } from 'Partners/stems';
import { stemEnclosesPosition } from 'Partners/stemEnclosesPosition';
import { compareNumbers } from 'Array/sort';

// returns the nearest stem enclosing the given position or undefined
// if no stems enclose the given position
// (assumes that the structure is a graphical tree where loops are vertices
// and stems are edges)
export function nearestStemEnclosingPosition(treeStructure: Partners, position: number): Stem | undefined {
  let enclosing = stems(treeStructure).filter(stem => stemEnclosesPosition(stem, position));

  enclosing.sort((a, b) => compareNumbers(
    Math.abs(upstreamPartner(topPair(a)) - position),
    Math.abs(upstreamPartner(topPair(b)) - position),
  ));

  return enclosing[0];
}