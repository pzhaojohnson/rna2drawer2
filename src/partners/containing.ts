import { Partners, partnerOf } from './Partners';
import { Stem } from './Stem';
import { UnpairedRegion } from './UnpairedRegion';
import { inBounds } from './bounds';
import { arePaired, isUnpaired } from './paired';
import { upstreamPartner } from 'Partners/pairs/Pair';
import { downstreamPartner } from 'Partners/pairs/Pair';

// returns the stem containing the given position
// or undefined if the position isn't in a stem
export function containingStem(partners: Partners, p: number): Stem | undefined {
  if (inBounds(partners, p)) {
    let q = partnerOf(partners, p);
    if (typeof q == 'number') {
      let p5 = upstreamPartner([p, q]);
      let p3 = downstreamPartner([p, q]);
      while (p5 - 1 > 0 && p3 + 1 <= partners.length && arePaired(partners, p5 - 1, p3 + 1)) {
        p5--;
        p3++;
      }
      let s = 1;
      while (p5 + s < p3 - s && arePaired(partners, p5 + s, p3 - s)) {
        s++;
      }
      return { position5: p5, position3: p3, size: s };
    }
  }
}

// returns the unpaired region containing the given position
// or undefined if the position isn't in an unpaired region
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
