import { Partners } from './Partners';

export function partnerOf(partners: Partners, p: number): number | null | undefined {
  return partners[p - 1];
}

export function isPaired(partners: Partners, p: number): boolean {
  return typeof partnerOf(partners, p) == 'number';
}

export function isUnpaired(partners: Partners, p: number): boolean {
  return !isPaired(partners, p);
}
