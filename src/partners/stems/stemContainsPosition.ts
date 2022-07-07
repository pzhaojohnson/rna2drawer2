import type { Stem } from 'Partners/stems/Stem';
import { bottomPair } from 'Partners/stems/Stem';
import { topPair } from 'Partners/stems/Stem';
import { PairWrapper } from 'Partners/pairs/PairWrapper';

export function stemContainsPosition(st: Stem, p: number): boolean {
  let bpr = new PairWrapper(bottomPair(st));
  let tpr = new PairWrapper(topPair(st));
  return (
    (p >= bpr.upstreamPartner && p <= tpr.upstreamPartner)
    || (p <= bpr.downstreamPartner && p >= tpr.downstreamPartner)
  );
}
