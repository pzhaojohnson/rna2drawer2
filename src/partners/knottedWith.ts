import { Partners } from './Partners';
import { partnerOf } from './paired';
import { areKnotted } from './areKnotted';

export type Pair = [number, number];

export function knottedWith(partners: Partners, pair: Pair): Pair[] {
  let knottedPairs: Pair[] = [];
  let u = Math.min(...pair);
  let d = Math.max(...pair);
  for (let p = u + 1; p < d; p++) {
    let q = partnerOf(partners, p);
    if (typeof q == 'number') {
      if (areKnotted(pair, [p, q])) {
        knottedPairs.push([p, q]);
      }
    }
  }
  return knottedPairs;
}
