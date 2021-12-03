export type Partners = (number | null | undefined)[];

export function partnerOf(partners: Partners, p: number): number | null | undefined {
  return partners[p - 1];
}

export function deepCopyPartners(partners: Partners): Partners {
  return [...partners];
}
