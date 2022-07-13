import type { Partners } from 'Partners/Partners';
import { hasKnots } from 'Partners/hasKnots';

/**
 * A structure has a tree shape if it contains no pseudoknots.
 */
export function isTree(partners: Partners): boolean {
  return !hasKnots(partners);
}
