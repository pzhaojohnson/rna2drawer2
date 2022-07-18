import type { Partners } from 'Partners/Partners';

export function hasKnots(partners: Partners): boolean {
  let knots = false;
  let upstreamStack: number[] = [];
  partners.forEach((q, i) => {
    let p = i + 1;
    if (typeof q == 'number') {
      if (p < q) {
        upstreamStack.push(p);
      } else {
        if (q != upstreamStack.pop()) {
          knots = true;
        }
      }
    }
  });
  return knots;
}
