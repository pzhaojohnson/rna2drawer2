import { Stem } from 'Partners/Stem';
import { pairs as pairsOfStem } from 'Partners/Stem';
import { upstreamPartner } from 'Partners/Pair';

// returns the positions of the upstream side of the stem
export function upstreamSideOfStem(stem: Stem): number[] {
  return pairsOfStem(stem).map(pair => upstreamPartner(pair));
}
