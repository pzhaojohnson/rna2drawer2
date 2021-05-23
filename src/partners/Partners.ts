import { Pair } from './Pair';

export type Partners = (number | null | undefined)[];

export function partnerOf(partners: Partners, p: number): number | null | undefined {
  return partners[p - 1];
}

// returns all pairs in the partners notation
export function pairs(partners: Partners): Pair[] {
  let prs: Pair[] = [];
  partners.forEach((q, i) => {
    let p = i + 1;
    if (typeof q == 'number' && p < q) {
      prs.push([p, q]);
    }
  });
  return prs;
}

export function unstructuredPartners(length=0): Partners {
  let partners: Partners = [];
  for (let i = 0; i < length; i++) {
    partners.push(null);
  }
  return partners;
}
