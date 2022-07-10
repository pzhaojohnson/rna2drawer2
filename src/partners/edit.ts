import type { Partners } from 'Partners/Partners';
import { partnerOf } from 'Partners/Partners';

export function pair(partners: Partners, p: number, q: number) {
  unpair(partners, p);
  unpair(partners, q);
  partners[p - 1] = q;
  partners[q - 1] = p;
}

export function unpair(partners: Partners, p: number) {
  let q = partnerOf(partners, p);
  partners[p - 1] = null;
  if (typeof q == 'number') {
    partners[q - 1] = null;
  }
}
