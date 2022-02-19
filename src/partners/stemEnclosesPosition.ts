import { Stem } from 'Partners/Stem';
import { topPair } from 'Partners/Stem';
import { upstreamPartner } from 'Partners/Pair';
import { downstreamPartner } from 'Partners/Pair';

export function stemEnclosesPosition(stem: Stem, position: number): boolean {
  return (
    upstreamPartner(topPair(stem)) < position
    && downstreamPartner(topPair(stem)) > position
  );
}
