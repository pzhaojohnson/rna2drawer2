import type { Stem } from 'Partners/stems/Stem';
import { topPair } from 'Partners/stems/Stem';
import { upstreamPartner } from 'Partners/pairs/Pair';
import { downstreamPartner } from 'Partners/pairs/Pair';

/**
 * Returns true if the position lies between the upstream
 * and downstream sides of the stem and false otherwise.
 *
 * This function returns false if the position is inside the stem,
 * though this behavior may not be firmly defined.
 */
export function stemEnclosesPosition(stem: Stem, position: number): boolean {
  return (
    upstreamPartner(topPair(stem)) < position
    && downstreamPartner(topPair(stem)) > position
  );
}
