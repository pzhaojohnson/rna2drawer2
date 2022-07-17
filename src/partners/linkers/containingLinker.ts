import type { Partners } from 'Partners/Partners';
import { positionIsInRange } from 'Partners/range';
import { isUnpaired } from 'Partners/isPaired';
import type { Linker } from 'Partners/linkers/Linker';

export type Args = { position: number };

/**
 * Returns the linker containing the given position
 * or undefined if the position is not in a linker.
 */
export function containingLinker(partners: Partners, args: Args): Linker | undefined {
  if (positionIsInRange(partners, args.position) && isUnpaired(partners, args.position)) {
    let bp5 = args.position - 1;
    while (bp5 > 0 && isUnpaired(partners, bp5)) {
      bp5--;
    }
    let bp3 = args.position + 1;
    while (bp3 <= partners.length && isUnpaired(partners, bp3)) {
      bp3++;
    }
    return { boundingPosition5: bp5, boundingPosition3: bp3 };
  }
}
