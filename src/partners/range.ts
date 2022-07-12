import type { Partners } from 'Partners/Partners';

export function positionIsInRange(partners: Partners, p: number): boolean {
  return (
    Number.isInteger(p)
    && p > 0
    && p <= partners.length
  );
}

export function positionIsOutOfRange(partners: Partners, p: number): boolean {
  return !positionIsInRange(partners, p);
}
