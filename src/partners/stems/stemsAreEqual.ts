import type { Stem } from 'Partners/stems/Stem';
import { bottomPair } from 'Partners/stems/Stem';
import { topPair } from 'Partners/stems/Stem';
import { pairsAreEqual } from 'Partners/pairs/pairsAreEqual';

export function stemsAreEqual(stem1: Stem, stem2: Stem): boolean {
  return (
    pairsAreEqual(bottomPair(stem1), bottomPair(stem2))
    && pairsAreEqual(topPair(stem1), topPair(stem2))
  );
}
