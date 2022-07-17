import type { Partners } from 'Partners/Partners';
import { positionIsInRange } from 'Partners/range';
import { isUnpaired } from 'Partners/isPaired';

import type { Linker } from 'Partners/linkers/Linker';
import { createLinker } from 'Partners/linkers/Linker';

export type Args = { position: number };

/**
 * Returns the linker containing the given position
 * or undefined if the position is not in a linker.
 */
export function containingLinker(partners: Partners, args: Args): Linker | undefined {
  if (!positionIsInRange(partners, args.position)) {
    return undefined;
  } else if (!isUnpaired(partners, args.position)) {
    return undefined;
  }

  let ubp = args.position - 1;
  while (ubp > 0 && isUnpaired(partners, ubp)) {
    ubp--;
  }
  let dbp = args.position + 1;
  while (dbp <= partners.length && isUnpaired(partners, dbp)) {
    dbp++;
  }
  return createLinker({ upstreamBoundingPosition: ubp, downstreamBoundingPosition: dbp });
}
