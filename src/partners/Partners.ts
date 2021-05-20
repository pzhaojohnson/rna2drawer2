export type Partners = (number | null | undefined)[];

export function partnerOf(partners: Partners, p: number): number | null | undefined {
  return partners[p - 1];
}

export function unstructuredPartners(length=0): Partners {
  let partners: Partners = [];
  for (let i = 0; i < length; i++) {
    partners.push(null);
  }
  return partners;
}
