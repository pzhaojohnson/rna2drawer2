import type { Partners } from 'Partners/Partners';

export function inBounds(partners: Partners, p: number): boolean {
  return (
    Number.isInteger(p)
    && p > 0
    && p <= partners.length
  );
}

export function outOfBounds(partners: Partners, p: number): boolean {
  return !inBounds(partners, p);
}
