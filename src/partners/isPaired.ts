import type { Partners } from 'Partners/Partners';
import { partnerOf } from 'Partners/Partners';

export function isPaired(partners: Partners, p: number): boolean {
  return partnerOf(partners, p) != undefined;
}

export function isUnpaired(partners: Partners, p: number): boolean {
  return !isPaired(partners, p);
}

export function arePaired(partners: Partners, p: number, q: number): boolean {
  return partnerOf(partners, p) == q;
}
