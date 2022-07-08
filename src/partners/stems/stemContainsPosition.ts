import type { Stem } from 'Partners/stems/Stem';
import { bottomPair } from 'Partners/stems/Stem';
import { topPair } from 'Partners/stems/Stem';
import { PairWrapper } from 'Partners/pairs/PairWrapper';

export function stemContainsPosition(stem: Stem, p: number): boolean {
  let bp = new PairWrapper(bottomPair(stem));
  let tp = new PairWrapper(topPair(stem));
  return (
    (p >= bp.upstreamPartner && p <= tp.upstreamPartner)
    || (p <= bp.downstreamPartner && p >= tp.downstreamPartner)
  );
}
