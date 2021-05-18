import { Partners } from './Partners';
import { UnpairedRegion } from './UnpairedRegion';
import { isUnpaired } from './paired';

// returns undefined if the position isn't in an unpaired region
export function containingUnpairedRegion(partners: Partners, p: number): UnpairedRegion | undefined {
  let inBounds = (
    Number.isFinite(p)
    && p > 0
    && p <= partners.length
  );
  if (inBounds && isUnpaired(partners, p)) {
    let bp5 = p - 1;
    while (bp5 > 0 && isUnpaired(partners, bp5)) {
      bp5--;
    }
    let bp3 = p + 1;
    while (bp3 <= partners.length && isUnpaired(partners, bp3)) {
      bp3++;
    }
    return { boundingPosition5: bp5, boundingPosition3: bp3 };
  }
}
