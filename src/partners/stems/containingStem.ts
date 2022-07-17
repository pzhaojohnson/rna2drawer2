import { Partners, partnerOf } from 'Partners/Partners';
import { Stem } from 'Partners/stems/Stem';
import { positionIsInRange } from 'Partners/range';
import { arePaired } from 'Partners/isPaired';
import { upstreamPartner } from 'Partners/pairs/Pair';
import { downstreamPartner } from 'Partners/pairs/Pair';

// returns the stem containing the given position
// or undefined if the position isn't in a stem
export function containingStem(partners: Partners, p: number): Stem | undefined {
  if (positionIsInRange(partners, p)) {
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
