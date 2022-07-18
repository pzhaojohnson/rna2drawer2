import type { Partners } from 'Partners/Partners';

export function hasKnots(partners: Partners): boolean {
  let knots = false;
  let upstreamPartners: number[] = [];
  partners.forEach((q, i) => {
    let p = i + 1;
    if (q == undefined) {
      // nothing to do
    } else if (p < q) {
      upstreamPartners.push(p);
    } else if (q != upstreamPartners.pop()) {
      knots = true;
    }
  });
  return knots;
}
